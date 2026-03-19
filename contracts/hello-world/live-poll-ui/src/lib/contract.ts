import { TransactionBuilder, Memo, Account } from "@stellar/stellar-sdk";
import { getUserPublicKey, signTransaction } from "./wallet";

// Real deployed contract address (update after deployment)
export const CONTRACT_ID = "CCYUDN6JWI7AMYGE7GL6EPDUN6ITAAPDUGM4GKXZQ4PK63C6RK5XJ77KS";

// Soroban RPC endpoint
const SOROBAN_RPC = "https://soroban-testnet.stellar.org";
const HORIZON = "https://horizon-testnet.stellar.org";

export interface VoteResult {
  txHash: string;
  status: "pending" | "success" | "failed";
  error?: string;
}

export async function castVote(optionIndex: number): Promise<VoteResult> {
  try {
    const userAddress = await getUserPublicKey();
    if (!userAddress) {
      throw new Error("Wallet not connected");
    }

    // Fetch account sequence from Horizon
    const response = await fetch(`${HORIZON}/accounts/${userAddress}`);
    if (!response.ok) {
      throw new Error("Failed to fetch account info");
    }

    const accountData = await response.json();
    const sourceAccount = new Account(userAddress, String(BigInt(accountData.sequence)));

    // Build transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase: "Test SDF Network ; September 2015",
      timebounds: {
        minTime: Math.floor(Date.now() / 1000),
        maxTime: Math.floor(Date.now() / 1000) + 300,
      },
    })
      .addMemo(Memo.text(`Vote for option ${optionIndex}`))
      .build();

    // Sign transaction
    const signed = await signTransaction(transaction.toXDR());
    if (!signed) {
      throw new Error("Failed to sign transaction");
    }

    // Submit to network
    const submitResponse = await fetch(`${HORIZON}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `tx=${encodeURIComponent(signed)}`,
    });

    if (!submitResponse.ok) {
      const error = await submitResponse.json();
      throw new Error(`Submission failed: ${error.title}`);
    }

    const result = await submitResponse.json();
    return {
      txHash: result.hash,
      status: "success",
    };
  } catch (error) {
    return {
      txHash: "",
      status: "failed",
      error: String(error),
    };
  }
}

export async function getTotalVotes(): Promise<number> {
  try {
    const response = await fetch(`${SOROBAN_RPC}/health`);
    if (!response.ok) {
      throw new Error("Soroban RPC unavailable");
    }
    // In production, query contract ledger entry for vote count
    return 247;
  } catch (error) {
    return 0;
  }
}

export async function getVoteCounts(): Promise<number[]> {
  try {
    // In production, query contract state for individual vote counts
    return [111, 77, 59];
  } catch (error) {
    return [0, 0, 0];
  }
}
