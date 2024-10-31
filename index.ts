import { parseEther } from "viem";
import { account, smartAccountClient } from "./config";
import { getUserOperationHash } from "viem/account-abstraction";

//** Send a transaction
// const hash = await smartAccountClient.sendTransaction({
//   calls: [
//     {
//       to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
//       value: parseEther("0.001"),
//     },
//   ],
// });
// console.log(`User operation included: https://sepolia.arbiscan.io/tx/${hash}`);

//** Estimate User Operation Gas
// const gas = await smartAccountClient.estimateUserOperationGas({
//   calls: [
//     {
//       to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
//       value: parseEther("0.001"),
//     },
//   ],
//   maxPriorityFeePerGas: 420n, // must include
//   maxFeePerGas: 420n, // must include
// });
// console.log(`
//   Verification gas limit: ${gas.verificationGasLimit} \n
//   Pre-verification gas: ${gas.preVerificationGas} \n
//   Call gas limit: ${gas.callGasLimit}`);

//** Get ChainId
// const chaindId = await smartAccountClient.getChainId();
// console.log(`ChainId: ${chaindId}`);

//** Get Supported Entrypoints
// const entrypoints = await smartAccountClient.getSupportedEntryPoints();
// console.log(`Supported entrypoints: ${entrypoints}`);

// ** Get User Operation ***/

// const userOperation = await smartAccountClient.getUserOperation({
//   // This is hash operation
//   hash: "0xe73aabbd1ef5ba61484bbe7788100a68c6977a7da88efb0b48f2eb9ce79e4e78",
// });
// console.table(
//   JSON.stringify(userOperation, (key, value) =>
//     typeof value === "bigint" ? Number(value) : value
//   )
// );

//** Prepare User Operation
// const userOperation = await smartAccountClient.prepareUserOperation({
//   calls: [
//     {
//       to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
//       value: parseEther("0.001"),
//     },
//   ],
// });
// console.log(`User operation:${userOperation}`);

// // Get the User Operation Hash
// const userOpHash = getUserOperationHash({
//   userOperation: {
//     ...userOperation,
//     sender:
//       userOperation.sender ?? (await smartAccountClient.account.getAddress()),
//     signature: "0x", // Placeholder for the actual signature
//   },
//   entryPointAddress: smartAccountClient.account.entryPoint.address,
//   entryPointVersion: smartAccountClient.account.entryPoint.version,
//   chainId: await smartAccountClient.getChainId(),
// });

// // Log the User Operation Hash
// console.log(`User Operation Hash: ${userOpHash}`);

// // Sign the User Operation Hash
// const signature = await account.signUserOperation({
//   ...userOperation,
// });
// console.log(`Signature: ${signature}`);
// userOperation.signature = signature;

// // Send the User Operation
// const hash = await smartAccountClient.sendUserOperation(userOperation);

// // Log the transaction hash
// console.log(`User operation included: https://sepolia.arbiscan.io/tx/${hash}`);

process.exit();
