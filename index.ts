import { parseEther } from "viem";
import { smartAccountClient } from "./config";

// const hash = await smartAccountClient.sendTransaction({
//   calls: [
//     {
//       to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
//       value: parseEther("0.001"),
//     },
//   ],
// });
// console.log(`User operation included: https://sepolia.arbiscan.io/tx/${hash}`);

// Estimate User Operation Gas
const gas = await smartAccountClient.estimateUserOperationGas({
  calls: [
    {
      to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
      value: parseEther("0.001"),
    },
  ],
  maxPriorityFeePerGas: 420n, // must include
  maxFeePerGas: 420n, // must include
});
console.log(`
  Verification gas limit: ${gas.verificationGasLimit} \n
  Pre-verification gas: ${gas.preVerificationGas} \n
  Call gas limit: ${gas.callGasLimit}`);

process.exit();
