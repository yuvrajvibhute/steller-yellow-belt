"use client";

import React, { useState, useCallback } from "react";
import WalletConnect from "../src/components/WalletConnect";
import PollCard from "../src/components/PollCard";
import ActivityFeed, { dispatchVoteEvent } from "../src/components/ActivityFeed";
import { VoteResult } from "../src/lib/contract";

const INITIAL_VOTES = [111, 77, 59];

interface TxEntry {
  result: VoteResult;
  option: number;
  ts: string;
}

export default function Home() {
  const [voteCounts, setVoteCounts] = useState<number[]>(INITIAL_VOTES);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [txHistory, setTxHistory] = useState<TxEntry[]>([]);

  const handleVote = useCallback((optionIndex: number, result: VoteResult) => {
    if (result.status === "success" || result.status === "pending") {
      setVoteCounts((prev) => {
        const next = [...prev];
        next[optionIndex] = (next[optionIndex] ?? 0) + 1;
        return next;
      });
      setHasVoted(true);
      setVotedOption(optionIndex);
    }
    const entry: TxEntry = {
      result,
      option: optionIndex,
      ts: new Date().toLocaleTimeString("en-US", { hour12: false }),
    };
    setTxHistory((prev) => [entry, ...prev]);
    // Dispatch to activity feed
    dispatchVoteEvent(optionIndex, "GDemo", result.txHash ?? "");
  }, []);

  return (
    <div className="page-root">
      {/* Animated background */}
      <div className="bg-elements">
        <div className="bg-grid" />
        <div className="orb primary" />
        <div className="orb secondary" />
      </div>

      {/* Header */}
      <header>
        <div className="logo">
          Star<span>Vote</span>
        </div>
        <div className="header-actions">
          <div className="network-badge">⚡ Testnet</div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="app-container">
        {/* Left sidebar: wallet + contract info */}
        <div className="sidebar">
          <WalletConnect
            onVote={handleVote}
            hasVoted={hasVoted}
            votedOption={votedOption}
            voteCounts={voteCounts}
          />
        </div>

        {/* Right main: poll card + activity feed */}
        <div className="main-content">
          <PollCard voteCounts={voteCounts} txHistory={txHistory} />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
