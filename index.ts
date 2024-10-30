import "dotenv/config";
import { createSmartAccountClient } from "permissionless";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { getAccountNonce } from "permissionless/actions";
import {
  Address,
  Hex,
  createPublicClient,
  getAddress,
  http,
  maxUint256,
  parseAbi,
  encodeFunctionData,
} from "viem";
import {
  entryPoint06Abi,
  entryPoint06Address,
  entryPoint07Address,
  EntryPointVersion,
  toSmartAccount,
} from "viem/account-abstraction";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

import { updateEnvFile } from "./utils";

const usdc = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const paymaster = "0x0000000000000039cd5e8ae05257ce51c473ddd1";

const apiKey = process.env.PIMLICO_API_KEY;

if (!apiKey) {
  throw new Error("PIMLICO_API_KEY is not set");
}

const privateKey =
  (process.env.PRIVATE_KEY as Hex) ??
  (() => {
    const pk = generatePrivateKey();
    updateEnvFile(".env", `PRIVATE_KEY=${pk}`);
    return pk;
  })();

export const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http("https://sepolia.arbitrum.org"),
});

const pimlicoUrl = `https://api.pimlico.io/v2/${arbitrumSepolia.id}/rpc?apikey=${apiKey}`;

const pimlicoClient = createPimlicoClient({
  chain: arbitrumSepolia,
  transport: http(pimlicoUrl),
  entryPoint: {
    address: entryPoint06Address,
    version: "0.6" as EntryPointVersion,
  },
});

let accountAddress: Address | undefined;

// const smartAccountClient = createSmartAccountClient({
//   account,
//   chain: arbitrumSepolia,
//   bundlerTransport: http(pimlicoUrl),
//   paymaster: pimlicoClient,
//   userOperation: {
//     estimateFeesPerGas: async () => {
//       return (await pimlicoClient.getUserOperationGasPrice()).fast;
//     },
//   },
// });

// console.log(
//   `Smart account address: https://sepolia.basescan.org/address/${account.address}`
// );

// const senderUsdcBalance = await publicClient.readContract({
//   abi: parseAbi(["function balanceOf(address account) returns (uint256)"]),
//   address: usdc,
//   functionName: "balanceOf",
//   args: [account.address],
// });

// if (senderUsdcBalance < 1_000_000n) {
//   throw new Error(
//     `insufficient USDC balance for counterfactual wallet address ${
//       account.address
//     }: ${
//       Number(senderUsdcBalance) / 1_000_000
//     } USDC, required at least 1 USDC. Load up balance at https://faucet.circle.com/`
//   );
// }

// console.log(
//   "Smart account USDC balance: ",
//   Number(senderUsdcBalance) / 1_000_000
// );

// const txHash = await smartAccountClient.sendTransaction({
//   calls: [
//     {
//       to: getAddress(usdc),
//       abi: parseAbi(["function approve(address,uint)"]),
//       functionName: "approve",
//       args: [paymaster, maxUint256],
//     },
//     {
//       to: getAddress("0xd8da6bf26964af9d7eed9e03e53415d37aa96045"),
//       data: "0x1234" as Hex,
//     },
//   ],
//   paymasterContext: {
//     token: usdc,
//   },
// });

// console.log(`transactionHash: https://sepolia.basescan.org/tx/${txHash}`);
// process.exit();
