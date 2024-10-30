import { Address, Hash } from "viem";

export interface UserOperation {
  sender: Address;
  nonce: bigint;
  initCode: Hash;
  callData: Hash;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hash;
  signature: Hash;
}
