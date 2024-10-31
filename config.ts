import "dotenv/config";

import { createPublicClient, Hex, http } from "viem";
import { entryPoint06Address } from "viem/account-abstraction";
import { arbitrumSepolia } from "viem/chains";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { updateEnvFile } from "./utils";
import { toBicSmartAccount } from "./accounts/toBicSmartAccounts";
import { createSmartAccountClient } from "permissionless";
import { createPimlicoClient } from "permissionless/clients/pimlico";

const apiKey = process.env.PIMLICO_API_KEY;

if (!apiKey) {
  throw new Error("PIMLICO_API_KEY is not set");
}

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

const privateKey =
  (process.env.PRIVATE_KEY as Hex) ??
  (() => {
    const pk = generatePrivateKey();
    updateEnvFile(".env", `PRIVATE_KEY=${pk}`);
    return pk;
  })();

const pimlicoUrl = `https://api.pimlico.io/v2/${arbitrumSepolia.id}/rpc?apikey=${apiKey}`;

const pimlicoClient = createPimlicoClient({
  transport: http(pimlicoUrl),
  entryPoint: {
    address: entryPoint06Address,
    version: "0.6",
  },
});

// Create a Bic Smart Account Instance
const account = await toBicSmartAccount({
  client,
  owner: privateKeyToAccount(privateKey),
  entryPoint: {
    address: entryPoint06Address,
    version: "0.6",
  },
});
console.log(`Account address: ${await account.getAddress()}`);

export const smartAccountClient = createSmartAccountClient({
  account,
  chain: arbitrumSepolia,
  bundlerTransport: http(pimlicoUrl),
  paymaster: pimlicoClient,
  userOperation: {
    estimateFeesPerGas: async () => {
      return (await pimlicoClient.getUserOperationGasPrice()).fast;
    },
  },
});
