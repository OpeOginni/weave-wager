import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WeaveWagerModule = buildModule("WeaveWager", (m) => {
  const weaveWager = m.contract("WeaveWager", []);

  return { weaveWager };
});

export default WeaveWagerModule;
