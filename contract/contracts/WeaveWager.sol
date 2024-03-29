// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

contract WeaveWager {
    // Struct to store wager details
    struct Wager {
        uint256 id;
        address creator; // Address of the creator of the wager
        uint256 matchId; // ID of the game being wagered on
        uint256 stake; // Amount To Be staked to Join
        uint256 totalStaked; // Total amoount Staked
        uint256 maxEntries; // Max number of Participants
        uint256 totalEntries; // Current Number of Participants
        uint256 matchStartTimestamp; // Timestamp when the match is to start
        bool resolved; // Flag indicating if the wager has been resolved
    }

    uint256 public totalWager;

    address public owner;

    // Mapping of match IDs to their creator's address
    mapping(uint256 => address) public wagerCreator;

    // Mapping of user address to the IDs of Wagers they joined
    mapping(address => uint256[]) public userWagers;

    // Mapping of wager IDs to their resolved status
    mapping(uint256 => bool) public wagerResolved;

    // Mapping of wager IDs to their entries
    mapping(uint256 => address[]) public wagerEntries;

    mapping(uint256 => mapping(address => bool)) private wagerParticipants;

    // Mapping of wager IDs to their winners
    mapping(uint256 => address[]) public wagerWinners;

    // mapping of the id to the wager
    mapping(uint256 => Wager) public wagers;

    // mapping of the gameId to the number of wagers created for that game
    mapping(uint256 => uint256) public gameWagerNumber;

    mapping(uint256 => mapping(address => bool)) private matchWagerCreated;

    // Event emitted when a new wager is created
    event WagerCreated(uint256 indexed wagerId, address indexed creator, uint256 matchId, uint256 stake);

    event WagerJoined(uint256 indexed wagerId, address indexed participant);

    event WagerCancled(uint256 indexed wagerId, address creator);

    event WagerResolved(uint256 indexed wagerId, address[] winners);

    constructor() {
        owner = payable(msg.sender);
    }
    // Function to create a new wager
    function createWager(uint256 _matchId, uint256 _stake, uint256 _maxEntries, uint256 _matchStartTimestamp) external payable {
        require(_stake > 0, 'Stake must be greater than zero');
        require(_maxEntries > 1, 'Max Entries must be greater than zero');
        require(msg.value == _stake, 'Sent Value must be equal to Stake');
        require(!matchWagerCreated[_matchId][msg.sender], 'User already created wager for this game');

        totalWager = totalWager + 1;

        // Create new wager
        Wager memory newWager = Wager({
            id: totalWager,
            creator: msg.sender,
            matchId: _matchId,
            stake: _stake,
            totalStaked: _stake,
            maxEntries: _maxEntries,
            totalEntries: 1,
            matchStartTimestamp: _matchStartTimestamp,
            resolved: false
        });

        // Record the creator of the game
        wagerCreator[newWager.id] = msg.sender;
        // Record the creator as a participant
        userWagers[msg.sender].push(newWager.id);

        wagerEntries[newWager.id].push(msg.sender);

        wagerParticipants[newWager.id][msg.sender] = true;

        wagers[totalWager] = newWager;

        matchWagerCreated[_matchId][msg.sender] = true;

        gameWagerNumber[_matchId] = gameWagerNumber[_matchId] + 1;
        // Emit event
        emit WagerCreated(newWager.id, msg.sender, _matchId, _stake);
    }

    function joinWager(uint256 _wagerId) external payable {
        Wager memory wager = getWager(_wagerId);
        require(wager.matchStartTimestamp > block.timestamp, "Can't Join Wager, Match already Started");
        require(!isParticipant(_wagerId, msg.sender), 'Address is already a participant');
        require(wager.totalEntries < wager.maxEntries, 'Max Entries for the Wager Reached');
        require(msg.value == wager.stake, 'Sent Value must be equal to Stake');

        userWagers[msg.sender].push(_wagerId);

        wagerEntries[_wagerId].push(msg.sender);

        wagerParticipants[_wagerId][msg.sender] = true;

        increaseWagerEntry(_wagerId);

        increaseWagerTotalStake(_wagerId);

        emit WagerJoined(_wagerId, msg.sender);
    }

    function cancleWager(uint256 _wagerId) external payable {
        Wager memory wager = getWager(_wagerId);

        require(wager.creator == msg.sender, 'Only the creator can cancle the stake');
        require(wager.totalEntries < 2, 'More than one user has staked');

        address creator = payable(wager.creator);
        uint256 stake = wager.stake;

        wager.resolved = true;
        wagerResolved[_wagerId] = true;

        (bool sent, bytes memory data) = creator.call{value: stake}('');

        require(sent, 'Failed to send Ether');

        emit WagerCancled(_wagerId, msg.sender);
    }

    function resolveWager(uint256 _wagerId, address[] calldata _winners) external onlyOwner {
        Wager memory wager = getWager(_wagerId);
        require(!wagerResolved[_wagerId], 'Wager has been resolved');
        require(_winners.length <= wager.totalEntries, 'Winners Array Is Bigger than Wager Entries');
        require(wager.matchStartTimestamp < block.timestamp, "Can't Resolve Wager, Match Havn't Started");

        wagerResolved[_wagerId] = true;
        wager.resolved = true;

        uint256 totalWinners = _winners.length;
        uint256 totalStake = wager.totalStaked;
        uint256 totalEntries = wager.totalEntries;

        if (totalWinners == 0 || totalWinners == totalEntries) {
            // No Winners or all players won, refund stakes to all players
            for (uint256 i; i < totalEntries; i++) {
                address participant = wagerEntries[_wagerId][i];

                (bool sent, bytes memory data) = payable(participant).call{value: totalStake / totalEntries}('');
                require(sent, 'Failed to send Ether');
            }
        } else {
            // Distribute winnings equally among winners
            uint256 totalWinnings = totalStake / totalWinners;

            for (uint256 i; i < totalWinners; i++) {
                require(isParticipant(_wagerId, _winners[i]), 'Address is not a participant');
                address winner = _winners[i];

                (bool sent, bytes memory data) = payable(winner).call{value: totalWinnings}('');
                require(sent, 'Failed to send Ether');
                wagerWinners[_wagerId].push(winner);
            }
        }

        emit WagerResolved(_wagerId, _winners);
    }

    function getWager(uint256 _wagerId) public view returns (Wager memory) {
        return wagers[_wagerId];
    }

    function getWagerWinners(uint256 _wagerId) public view returns (address[] memory) {
        return wagerWinners[_wagerId];
    }

    function getUserWagers(address _user) public view returns (uint256[] memory) {
        return userWagers[_user];
    }

    function getNumberOfWagers(uint256 _gameId) public view returns (uint256) {
        return gameWagerNumber[_gameId];
    }

    function isParticipant(uint256 _wagerId, address _address) public view returns (bool) {
        return wagerParticipants[_wagerId][_address];
    }

    function hasCreatedMatchWager(uint256 _matchId, address _address) public view returns (bool) {
        return matchWagerCreated[_matchId][_address];
    }

    function increaseWagerEntry(uint256 _wagerId) private {
        wagers[_wagerId].totalEntries = wagers[_wagerId].totalEntries + 1;
    }

    function increaseWagerTotalStake(uint256 _wagerId) private {
        wagers[_wagerId].totalStaked = wagers[_wagerId].totalStaked + wagers[_wagerId].stake;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Function can Only be called by owner');
        _;
    }

    receive() external payable {}
}
