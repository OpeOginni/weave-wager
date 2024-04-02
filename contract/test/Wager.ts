import { ignition, ethers } from 'hardhat';
import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import WeaveWagerModule from '../ignition/modules/WeaveWager';
import { expect } from 'chai';

describe('Wager Contract', () => {
  async function deployWeaveWagerModuleFixture() {
    const [deployer, user1, user2] = await ethers.getSigners();
    const { weaveWager } = await ignition.deploy(WeaveWagerModule, {
      defaultSender: deployer.address,
    });

    const ONE_WEEK_IN_SECS = 7 * 24 * 60 * 60;
    const MATCH_START_TIME = (await time.latest()) + ONE_WEEK_IN_SECS;
    const TEN_ETH = ethers.parseEther('10');

    return { weaveWager, deployer, user1, user2, TEN_ETH, MATCH_START_TIME };
  }

  async function createWagerFixture() {
    const [deployer, user1, user2] = await ethers.getSigners();
    const { weaveWager } = await ignition.deploy(WeaveWagerModule);

    const ONE_WEEK_IN_SECS = 7 * 24 * 60 * 60;
    const MATCH_START_TIME = (await time.latest()) + ONE_WEEK_IN_SECS;

    const TEN_ETH = ethers.parseEther('10');
    const GAME_ID = 1;
    const WAGER_ID = 1;
    const MAX_ENTRIES = 2;

    await weaveWager.createWager(GAME_ID, TEN_ETH, MAX_ENTRIES, MATCH_START_TIME, {
      value: TEN_ETH,
    });

    return { weaveWager, deployer, user1, user2, TEN_ETH, WAGER_ID, MATCH_START_TIME };
  }

  async function completeWagerFixture() {
    const [deployer, user1, user2, nonParticipant] = await ethers.getSigners();
    const { weaveWager } = await ignition.deploy(WeaveWagerModule);

    const ONE_WEEK_IN_SECS = 7 * 24 * 60 * 60;
    const MATCH_START_TIME = (await time.latest()) + ONE_WEEK_IN_SECS;

    const TEN_ETH = ethers.parseEther('10');
    const GAME_ID = 1;
    const WAGER_ID = 1;
    const MAX_ENTRIES = 3;

    await weaveWager.createWager(GAME_ID, TEN_ETH, MAX_ENTRIES, MATCH_START_TIME, {
      value: TEN_ETH,
    });

    await weaveWager.connect(user1).joinWager(GAME_ID, {
      value: TEN_ETH,
    });

    await weaveWager.connect(user2).joinWager(GAME_ID, {
      value: TEN_ETH,
    });

    return { weaveWager, deployer, user1, user2, nonParticipant, TEN_ETH, WAGER_ID, MATCH_START_TIME };
  }

  describe('deployment', () => {
    it('Should set the right owner', async () => {
      const { weaveWager, deployer } = await loadFixture(deployWeaveWagerModuleFixture);

      expect(await weaveWager.owner()).to.equal(deployer.address);
    });
  });

  describe('creating wager', () => {
    it('should error if creator doesnt pass in enough Ether', async () => {
      const { weaveWager, TEN_ETH, MATCH_START_TIME } = await loadFixture(deployWeaveWagerModuleFixture);

      await expect(weaveWager.createWager(1, TEN_ETH, 3, MATCH_START_TIME)).to.be.revertedWith('Sent Value must be equal to Stake');
    });

    it('should let a user create a wager', async () => {
      const { weaveWager, deployer, TEN_ETH, MATCH_START_TIME } = await loadFixture(deployWeaveWagerModuleFixture);

      await weaveWager.createWager(1, TEN_ETH, 3, MATCH_START_TIME, {
        value: TEN_ETH,
      });

      const creatorAddress = await weaveWager.wagerCreator(1);

      expect(creatorAddress).to.be.equal(deployer.address);
    });

    it('should return creator ether after canceling wager', async () => {
      const { weaveWager, deployer, TEN_ETH, MATCH_START_TIME } = await loadFixture(deployWeaveWagerModuleFixture);

      await weaveWager.createWager(1, TEN_ETH, 3, MATCH_START_TIME, {
        value: TEN_ETH,
      });

      // Balance after Staking 10 ETH
      const balanceBefore = await ethers.provider.getBalance(deployer.address);

      await weaveWager.cancleWager(1);

      // Balance after canceling and Receiving 10 ETH back
      const balanceNow = await ethers.provider.getBalance(deployer.address);

      expect(balanceNow).to.be.greaterThan(balanceBefore);
    });

    it('should revert when another user tries to cancle a wager', async () => {
      const { weaveWager, user1, TEN_ETH, MATCH_START_TIME } = await loadFixture(deployWeaveWagerModuleFixture);

      await weaveWager.createWager(1, TEN_ETH, 3, MATCH_START_TIME, {
        value: TEN_ETH,
      });

      await expect(weaveWager.connect(user1).cancleWager(1)).to.revertedWith('Only the creator can cancle the stake');
    });
  });

  describe('joining wager', () => {
    it('should error if user doesnt pass in enough Ether', async () => {
      const { weaveWager, user1, WAGER_ID } = await loadFixture(createWagerFixture);

      await expect(weaveWager.connect(user1).joinWager(WAGER_ID)).to.be.revertedWith('Sent Value must be equal to Stake');
    });

    it('should let a user join a wager with correct amount', async () => {
      const { weaveWager, user1, TEN_ETH, WAGER_ID } = await loadFixture(createWagerFixture);

      await weaveWager.connect(user1).joinWager(WAGER_ID, {
        value: TEN_ETH,
      });

      const userWagers = await weaveWager.getUserWagers(user1.address);

      expect(userWagers).to.include(BigInt(WAGER_ID));
    });

    it('should revert when trying to cancle a wager after a user has joined and staked', async () => {
      const { weaveWager, user1, TEN_ETH, WAGER_ID } = await loadFixture(createWagerFixture);

      await weaveWager.connect(user1).joinWager(WAGER_ID, {
        value: TEN_ETH,
      });

      // Balance after canceling and Receiving 10 ETH back

      await expect(weaveWager.cancleWager(1)).to.revertedWith('More than one user has staked');
    });

    it('should error out when a user tries to join the wager twice', async () => {
      const { weaveWager, user1, TEN_ETH, WAGER_ID } = await loadFixture(createWagerFixture);

      await weaveWager.connect(user1).joinWager(WAGER_ID, {
        value: TEN_ETH,
      });

      await expect(
        weaveWager.connect(user1).joinWager(WAGER_ID, {
          value: TEN_ETH,
        }),
      ).to.be.revertedWith('Address is already a participant');
    });

    it("should error out when a new user wants to join and the entries have reached it's max", async () => {
      const { weaveWager, user1, user2, TEN_ETH, WAGER_ID } = await loadFixture(createWagerFixture);

      await weaveWager.connect(user1).joinWager(WAGER_ID, {
        value: TEN_ETH,
      });

      await expect(
        weaveWager.connect(user2).joinWager(WAGER_ID, {
          value: TEN_ETH,
        }),
      ).to.be.revertedWith('Max Entries for the Wager Reached');
    });

    it('should error out when a user wants to join after the match has started', async () => {
      const { weaveWager, user1, TEN_ETH, WAGER_ID, MATCH_START_TIME } = await loadFixture(createWagerFixture);

      await time.increaseTo(MATCH_START_TIME);

      await expect(
        weaveWager.connect(user1).joinWager(WAGER_ID, {
          value: TEN_ETH,
        }),
      ).to.be.revertedWith("Can't Join Wager, Match already Started");
    });
  });

  describe('resolving wager', () => {
    it('should revert when called by an address that isnt a participant', async () => {
      const { weaveWager, user2, nonParticipant, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      await time.increaseTo(MATCH_START_TIME);

      await expect(weaveWager.connect(nonParticipant).resolveWager(WAGER_ID, [user2.address])).to.revertedWith('Address is not a participant');
    });

    it('should revert if the wager is being resolved before the match starts', async () => {
      const { weaveWager, user2, WAGER_ID } = await loadFixture(completeWagerFixture);

      await expect(weaveWager.resolveWager(WAGER_ID, [user2.address])).to.revertedWith("Can't Resolve Wager, Match Havn't Started");
    });

    it('should send reward to SINGLE WINNER after resolving', async () => {
      const { weaveWager, user2, TEN_ETH, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      const balanceBefore = await ethers.provider.getBalance(user2.address);

      await time.increaseTo(MATCH_START_TIME);

      await weaveWager.resolveWager(WAGER_ID, [user2.address]);

      const balanceNow = await ethers.provider.getBalance(user2.address);

      expect(balanceNow).to.be.greaterThan(balanceBefore);
      expect(balanceNow).to.be.equal(TEN_ETH * BigInt(3) + balanceBefore);
    });

    it('should send reward to MULTIPLE WINNERS after resolving', async () => {
      const { weaveWager, user1, user2, TEN_ETH, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      const balanceBeforeUser2 = await ethers.provider.getBalance(user2.address);
      const balanceBeforeUser1 = await ethers.provider.getBalance(user1.address);

      await time.increaseTo(MATCH_START_TIME);

      await weaveWager.resolveWager(WAGER_ID, [user2.address, user1.address]);

      const balanceNowUser2 = await ethers.provider.getBalance(user2.address);
      const balanceNowUser1 = await ethers.provider.getBalance(user1.address);

      expect(balanceNowUser2).to.be.greaterThan(balanceBeforeUser2);
      expect(balanceNowUser1).to.be.greaterThan(balanceBeforeUser1);

      expect(balanceNowUser2).to.be.equal((TEN_ETH * BigInt(3)) / BigInt(2) + balanceBeforeUser2);
      expect(balanceNowUser1).to.be.equal((TEN_ETH * BigInt(3)) / BigInt(2) + balanceBeforeUser1);
    });

    it('should return back stakes if no one wins', async () => {
      const { weaveWager, deployer, user1, user2, TEN_ETH, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      const balanceBeforeUser2 = await ethers.provider.getBalance(user2.address);
      const balanceBeforeUser1 = await ethers.provider.getBalance(user1.address);
      const balanceBeforeDeployer = await ethers.provider.getBalance(deployer.address);

      await time.increaseTo(MATCH_START_TIME);

      await weaveWager.resolveWager(WAGER_ID, []);

      const balanceNowUser2 = await ethers.provider.getBalance(user2.address);
      const balanceNowUser1 = await ethers.provider.getBalance(user1.address);
      const balanceNowDeployer = await ethers.provider.getBalance(deployer.address);

      expect(balanceNowUser2).to.be.greaterThan(balanceBeforeUser2);
      expect(balanceNowUser1).to.be.greaterThan(balanceBeforeUser1);
      expect(balanceNowDeployer).to.be.greaterThan(balanceBeforeDeployer);

      expect(balanceNowUser2).to.be.equal(TEN_ETH + balanceBeforeUser2);
      expect(balanceNowUser1).to.be.equal(TEN_ETH + balanceBeforeUser1);
    });

    it('should return back stakes if everyone wins', async () => {
      const { weaveWager, deployer, user1, user2, TEN_ETH, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      const balanceBeforeUser2 = await ethers.provider.getBalance(user2.address);
      const balanceBeforeUser1 = await ethers.provider.getBalance(user1.address);
      const balanceBeforeDeployer = await ethers.provider.getBalance(deployer.address);

      await time.increaseTo(MATCH_START_TIME);

      await weaveWager.resolveWager(WAGER_ID, [deployer.address, user1.address, user2.address]);

      const balanceNowUser2 = await ethers.provider.getBalance(user2.address);
      const balanceNowUser1 = await ethers.provider.getBalance(user1.address);
      const balanceNowDeployer = await ethers.provider.getBalance(deployer.address);

      expect(balanceNowUser2).to.be.greaterThan(balanceBeforeUser2);
      expect(balanceNowUser1).to.be.greaterThan(balanceBeforeUser1);
      expect(balanceNowDeployer).to.be.greaterThan(balanceBeforeDeployer);

      expect(balanceNowUser2).to.be.equal(TEN_ETH + balanceBeforeUser2);
      expect(balanceNowUser1).to.be.equal(TEN_ETH + balanceBeforeUser1);
    });

    it('should revert if the winners array is larger than the entries number', async () => {
      const { weaveWager, deployer, user1, user2, nonParticipant, TEN_ETH, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      await time.increaseTo(MATCH_START_TIME);

      await expect(weaveWager.resolveWager(WAGER_ID, [deployer.address, user1.address, user2.address, nonParticipant.address])).to.revertedWith(
        'Winners Array Is Bigger than Wager Entries',
      );
    });

    it('should revert if the winners array contains an address that wasnt a participant', async () => {
      const { weaveWager, user2, nonParticipant, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      await time.increaseTo(MATCH_START_TIME);

      await expect(weaveWager.resolveWager(WAGER_ID, [nonParticipant.address])).to.revertedWith('Address is not a participant');
    });

    it('should revert if the winners array contains an address that wasnt a participant', async () => {
      const { weaveWager, user2, nonParticipant, WAGER_ID, MATCH_START_TIME } = await loadFixture(completeWagerFixture);

      await time.increaseTo(MATCH_START_TIME);

      await expect(weaveWager.resolveWager(WAGER_ID, [user2.address, nonParticipant.address])).to.revertedWith('Address is not a participant');
    });
  });
});

// https://hardhat.org/hardhat-runner/docs/getting-started#overview

// https://hardhat.org/ignition/docs/guides/tests
