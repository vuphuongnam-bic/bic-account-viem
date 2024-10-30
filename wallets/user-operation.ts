// user-operation-builder.ts
import { type Hash, type Address, encodePacked, parseEther } from "viem";
import { UserOperation } from "../types";

export class UserOperationBuilder {
  private userOperation: Partial<UserOperation> = {};

  setSender(sender: Address): this {
    this.userOperation.sender = sender;
    return this;
  }

  setNonce(nonce: bigint): this {
    this.userOperation.nonce = nonce;
    return this;
  }

  setInitCode(initCode: Hash): this {
    this.userOperation.initCode = initCode;
    return this;
  }

  setCallData(callData: Hash): this {
    this.userOperation.callData = callData;
    return this;
  }

  setCallGasLimit(callGasLimit: bigint): this {
    this.userOperation.callGasLimit = callGasLimit;
    return this;
  }

  setVerificationGasLimit(verificationGasLimit: bigint): this {
    this.userOperation.verificationGasLimit = verificationGasLimit;
    return this;
  }

  setPreVerificationGas(preVerificationGas: bigint): this {
    this.userOperation.preVerificationGas = preVerificationGas;
    return this;
  }

  setMaxFeePerGas(maxFeePerGas: bigint): this {
    this.userOperation.maxFeePerGas = maxFeePerGas;
    return this;
  }

  setMaxPriorityFeePerGas(maxPriorityFeePerGas: bigint): this {
    this.userOperation.maxPriorityFeePerGas = maxPriorityFeePerGas;
    return this;
  }

  setPaymasterAndData(paymasterAndData: Hash): this {
    this.userOperation.paymasterAndData = paymasterAndData;
    return this;
  }

  setSignature(signature: Hash): this {
    this.userOperation.signature = signature;
    return this;
  }

  build(): UserOperation {
    // Validate all required fields are set
    if (!this.isComplete()) {
      throw new Error("UserOperation is incomplete");
    }
    return this.userOperation as UserOperation;
  }

  private isComplete(): boolean {
    return Object.values(this.userOperation).every(
      (value) => value !== undefined
    );
  }
}
