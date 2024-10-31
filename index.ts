import { parseEther } from "viem";
import { smartAccountClient } from "./config";

const hash = await smartAccountClient.sendTransaction({
  calls: [
    {
      to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
      value: parseEther("0.001"),
    },
  ],
});
console.log(`User operation included: https://sepolia.arbiscan.io/tx/${hash}`);
process.exit();
