import {
  type Address,
  type Client,
  type Hex,
  type LocalAccount,
  encodeFunctionData,
} from "viem";
import { getChainId, signMessage } from "viem/actions";
import {
  type SmartAccount,
  type SmartAccountImplementation,
  UserOperation,
  entryPoint06Abi,
  entryPoint07Abi,
  entryPoint07Address,
  getUserOperationHash,
  toSmartAccount,
} from "viem/account-abstraction";
import { getAction } from "viem/utils";

import type {
  Account,
  Assign,
  Chain,
  EIP1193Provider,
  OneOf,
  Transport,
  WalletClient,
} from "viem";

import { getAccountNonce, getSenderAddress } from "permissionless/actions";
import { toOwner } from "permissionless/utils";

import { BICAccountABI, BICAccountFactoryABI } from "../abis";

/**
 * The account creation ABI for Bic Smart Account (from the Bic SmartAccountFactory)
 */

/**
 * Default addresses for Bic Smart Account
 */
const FACTORY_ADDRESS: Address = "0x59858dfFd8A51cdB096520168c4b951AD1942EF4";

const getAccountInitCode = async ({
  owner,
  index,
}: {
  owner: Address;
  index: bigint;
}): Promise<Hex> => {
  if (!owner) throw new Error("Owner account not found");

  return encodeFunctionData({
    abi: BICAccountFactoryABI,
    functionName: "createAccount",
    args: [owner, index],
  });
};

export type ToBicSmartAccountParameters<
  entryPointVersion extends "0.6" | "0.7"
> = {
  client: Client;
  owner: OneOf<
    | EIP1193Provider
    | WalletClient<Transport, Chain | undefined, Account>
    | LocalAccount
  >;
  factoryAddress?: Address;
  entryPoint?: {
    address: Address;
    version: entryPointVersion;
  };
  index?: bigint;
  address?: Address;
  nonceKey?: bigint;
};

export type BicSmartAccountImplementation<
  entryPointVersion extends "0.6" | "0.7" = "0.7"
> = Assign<
  SmartAccountImplementation<
    entryPointVersion extends "0.6"
      ? typeof entryPoint06Abi
      : typeof entryPoint07Abi,
    entryPointVersion
  >,
  { sign: NonNullable<SmartAccountImplementation["sign"]> }
>;

export type ToBicSmartAccountReturnType<
  entryPointVersion extends "0.6" | "0.7" = "0.7"
> = SmartAccount<BicSmartAccountImplementation<entryPointVersion>>;

/**
 * Create a Bic Smart Account client that can be used to interact with
 * a Bic Smart Account.
 * @param parameters.client - The client to use to interact with the account.
 * @param parameters.owner - The owner of the account.
 * @param parameters.factoryAddress - The address of the Bic Smart Account factory contract.
 * @param parameters.index - The index of the account.
 * @param parameters.address - The address of the account, if it already exists.
 * @returns A Bic Smart Account client that can be used to interact with the account.
 */
export async function toBicSmartAccount<
  entryPointVersion extends "0.6" | "0.7"
>(
  parameters: ToBicSmartAccountParameters<entryPointVersion>
): Promise<ToBicSmartAccountReturnType<entryPointVersion>> {
  const {
    client,
    owner,
    factoryAddress: _factoryAddress,
    index = BigInt(0),
    address,
  } = parameters;

  const localOwner = await toOwner({ owner });

  const entryPoint = {
    address: parameters.entryPoint?.address ?? entryPoint07Address,
    abi:
      (parameters.entryPoint?.version ?? "0.7") === "0.6"
        ? entryPoint06Abi
        : entryPoint07Abi,
    version: parameters.entryPoint?.version ?? "0.7",
  } as const;

  const factoryAddress = parameters.factoryAddress ?? FACTORY_ADDRESS;

  let accountAddress: Address | undefined = address;

  /**
   * Gets the factory address and initialization code required to create a new
   * Bic Smart Account.
   *
   * @returns An object containing the factory address and initialization code.
   */
  const getFactoryArgs = async () => {
    return {
      factory: factoryAddress,
      factoryData: await getAccountInitCode({
        owner: localOwner.address,
        index,
      }),
    };
  };

  let chainId: number;

  const getMemoizedChainId = async () => {
    if (chainId) return chainId;
    chainId = client.chain
      ? client.chain.id
      : await getAction(client, getChainId, "getChainId")({});
    return chainId;
  };

  return toSmartAccount({
    client,
    entryPoint,
    getFactoryArgs,
    async getAddress() {
      if (accountAddress) return accountAddress;

      const { factory, factoryData } = await getFactoryArgs();

      // Get the sender address based on the init code
      accountAddress = await getSenderAddress(client, {
        factory,
        factoryData,
        entryPointAddress: entryPoint.address,
      });

      return accountAddress;
    },
    async getNonce(args) {
      const address = await this.getAddress();
      return getAccountNonce(client, {
        address,
        entryPointAddress: entryPoint.address,
        key: args?.key ?? parameters?.nonceKey,
      });
    },
    encodeCalls: async (calls) => {
      if (calls.length > 1) {
        // Encode a batched call
        return encodeFunctionData({
          abi: BICAccountABI,
          functionName: "executeBatch",
          args: [
            calls.map((a) => a.to),
            calls.map((a) => a.value ?? 0n),
            calls.map((a) => a.data ?? "0x"),
          ],
        });
      }
      const { to, value, data } = calls[0];
      // Encode a simple call
      return encodeFunctionData({
        abi: BICAccountABI,
        functionName: "execute",
        args: [to, value ?? 0n, data ?? "0x"],
      });
    },
    async getStubSignature() {
      return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
    },
    async sign({ hash }) {
      return this.signMessage({ message: hash });
    },
    signMessage: async (_) => {
      throw new Error("Simple account isn't 1271 compliant");
    },
    signTypedData: async (_) => {
      throw new Error("Simple account isn't 1271 compliant");
    },
    // Sign a user operation
    async signUserOperation(parameters) {
      const { chainId = await getMemoizedChainId(), ...userOperation } =
        parameters;
      return signMessage(client, {
        account: localOwner,
        message: {
          raw: getUserOperationHash({
            userOperation: {
              ...userOperation,
              sender: userOperation.sender ?? (await this.getAddress()),
              signature: "0x",
            } as UserOperation<entryPointVersion>,
            entryPointAddress: entryPoint.address,
            entryPointVersion: entryPoint.version,
            chainId: chainId,
          }),
        },
      });
    },
  }) as Promise<ToBicSmartAccountReturnType<entryPointVersion>>;
}
