export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "wagerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "WagerCancled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "wagerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "WagerCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "wagerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "participant",
        type: "address",
      },
    ],
    name: "WagerJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "wagerId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "winners",
        type: "address[]",
      },
    ],
    name: "WagerResolved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
    ],
    name: "cancleWager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxEntries",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_matchStartTimestamp",
        type: "uint256",
      },
    ],
    name: "createWager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "gameWagerNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
    ],
    name: "getNumberOfWagers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserWagers",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
    ],
    name: "getWager",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalStaked",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxEntries",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalEntries",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "matchStartTimestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "resolved",
            type: "bool",
          },
        ],
        internalType: "struct WeaveWager.Wager",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
    ],
    name: "getWagerWinners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "hasCreatedMatchWager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isParticipant",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
    ],
    name: "joinWager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "_winners",
        type: "address[]",
      },
    ],
    name: "resolveWager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalWager",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userWagers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "wagerCreator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "wagerEntries",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "wagerResolved",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "wagerWinners",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "wagers",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalStaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxEntries",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalEntries",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "matchStartTimestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "resolved",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export const createWagerAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxEntries",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_matchStartTimestamp",
        type: "uint256",
      },
    ],
    name: "createWager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const createdWagerEventAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "wagerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "WagerCreated",
    type: "event",
  },
];

export const getWagerAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
    ],
    name: "getWager",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalStaked",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxEntries",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalEntries",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "matchStartTimestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "resolved",
            type: "bool",
          },
        ],
        internalType: "struct WeaveWager.Wager",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const isParticipantAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isParticipant",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const hasCreatedMatchWagerAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_matchId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "hasCreatedMatchWager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const resolveWagerAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "_winners",
        type: "address[]",
      },
    ],
    name: "resolveWager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const joinWagerAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
    ],
    name: "joinWager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const cancleWagerAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_wagerId",
        type: "uint256",
      },
    ],
    name: "cancleWager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
