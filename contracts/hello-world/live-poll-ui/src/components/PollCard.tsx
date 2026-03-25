"use client";

import React from "react";
import { VoteResult } from "../lib/contract";

const POLL_OPTIONS = ["Option A — Increase Validator Rewards", "Option B — Reduce Transaction Fees", "Option C — Add New Asset Types"];
const COLORS = ["#00f2fe", "#8e2de2", "#f59e0b"];
const BAR_CLASSES = ["a", "b", "c"];

interface TxEntry {
  result: VoteResult;
  option: number;
  ts: string;
}

interface PollCardProps {
  voteCounts: number[];
  txHistory: TxEntry[];
}

export default function PollCard({ voteCounts, txHistory }: PollCardProps) {
  const total = voteCounts.reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Poll Question Card */}
      <div className="glass-panel poll-card">
        <div className="poll-badge">
          <span className="live-dot" />
          Live Poll
        </div>
        <div className="poll-question">
          Which Stellar upgrade should be prioritized next?
        </div>
        <div className="poll-meta">
          <span>📊 {total.toLocaleString()} votes recorded</span>
          <span>🔗 Stellar Testnet</span>
          <span>⏱️ Closes 2026-04-01</span>
        </div>

        {/* Results Chart */}
        <div className="results-chart">
          <div className="chart-title">Live Results</div>
          {POLL_OPTIONS.map((label, i) => {
            const pct = total > 0 ? Math.round((voteCounts[i] / total) * 100) : 0;
            return (
              <div key={i} className="chart-bar-wrap">
                <div className="chart-label">
                  <span>{label}</span>
                  <span>{pct}% ({voteCounts[i]})</span>
                </div>
                <div className="chart-track">
                  <div
                    className={`chart-fill ${BAR_CLASSES[i]}`}
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}99)`, boxShadow: `0 0 15px ${COLORS[i]}88` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      {txHistory.length > 0 && (
        <div className="glass-panel">
          <div className="panel-header">🔄 Transaction History</div>
          <div className="tx-list">
            {txHistory.map((entry, i) => (
              <div key={i} className={`tx-item`}>
                <div className={`tx-icon ${entry.result.status}`}>
                  {entry.result.status === "pending" && "⏳"}
                  {entry.result.status === "success" && "✅"}
                  {entry.result.status === "failed" && "❌"}
                </div>
                <div className="tx-info">
                  <div className="tx-label" style={{ color: COLORS[entry.option] }}>
                    Voted: {POLL_OPTIONS[entry.option].split("—")[0].trim()}
                  </div>
                  {entry.result.txHash ? (
                    <a
                      className="tx-hash"
                      href={`https://stellar.expert/explorer/testnet/tx/${entry.result.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.result.txHash.slice(0, 16)}…
                    </a>
                  ) : (
                    <div className="tx-hash muted">{entry.result.error ?? "No hash"}</div>
                  )}
                </div>
                <div className={`tx-status-badge tx-${entry.result.status}`}>
                  {entry.result.status}
                </div>
                <div className="tx-time muted" style={{ fontSize: 11, marginLeft: "auto" }}>{entry.ts}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
