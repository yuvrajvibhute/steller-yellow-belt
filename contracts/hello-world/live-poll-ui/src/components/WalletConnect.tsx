"use client";

import React, { useState, useCallback } from "react";
import { connectWallet } from "../lib/wallet";
import { castVote, VoteResult } from "../lib/contract";

const WALLETS = [
  { id: "freighter", name: "Freighter", icon: "🪐", desc: "Browser Extension" },
  { id: "albedo", name: "Albedo", icon: "🌟", desc: "Web-based Wallet" },
  { id: "xbull", name: "xBull", icon: "🐂", desc: "Mobile & Web" },
  { id: "lobstr", name: "LOBSTR", icon: "🦞", desc: "Mobile Wallet" },
];

const POLL_OPTIONS = [
  { label: "Option A — Increase Validator Rewards", color: "#00f2fe" },
  { label: "Option B — Reduce Transaction Fees", color: "#8e2de2" },
  { label: "Option C — Add New Asset Types", color: "#f59e0b" },
];

interface WalletConnectProps {
  onVote: (optionIndex: number, result: VoteResult) => void;
  hasVoted: boolean;
  votedOption: number | null;
  voteCounts: number[];
}

export default function WalletConnect({ onVote, hasVoted, votedOption, voteCounts }: WalletConnectProps) {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<{ type: string; msg: string } | null>(null);
  const [txStatus, setTxStatus] = useState<VoteResult | null>(null);

  const totalVotes = voteCounts.reduce((a, b) => a + b, 0);

  const handleConnect = useCallback(async (walletId: string) => {
    setError(null);
    setIsConnecting(true);
    setSelectedWallet(walletId);
    try {
      const address = await connectWallet(walletId);
      setConnectedAddress(address);
    } catch (e) {
      setError({ type: "Connection Failed", msg: String(e) });
      setSelectedWallet(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = () => {
    setConnectedAddress(null);
    setSelectedWallet(null);
    setSelectedOption(null);
    setTxStatus(null);
    setError(null);
  };

  const handleVote = useCallback(async () => {
    if (selectedOption === null || !connectedAddress) return;
    if (hasVoted) {
      setError({ type: "Already Voted", msg: "You have already cast your vote in this poll." });
      return;
    }
    setError(null);
    setIsVoting(true);
    setTxStatus({ txHash: "", status: "pending" });
    try {
      const result = await castVote(selectedOption);
      setTxStatus(result);
      onVote(selectedOption, result);
    } catch (e) {
      const failed: VoteResult = { txHash: "", status: "failed", error: String(e) };
      setTxStatus(failed);
      setError({ type: "Transaction Failed", msg: String(e) });
    } finally {
      setIsVoting(false);
    }
  }, [selectedOption, connectedAddress, hasVoted, onVote]);

  return (
    <div className="wc-root">
      {/* Wallet Selection Panel */}
      <div className="glass-panel">
        <div className="panel-header">
          {connectedAddress ? "✅ Wallet Connected" : "🔗 Connect Wallet"}
        </div>
        <div className="panel-body">
          {!connectedAddress ? (
            <div className="wallet-list">
              {WALLETS.map((w) => (
                <button
                  key={w.id}
                  className={`wallet-btn${selectedWallet === w.id ? " active" : ""}`}
                  onClick={() => handleConnect(w.id)}
                  disabled={isConnecting}
                >
                  <div className="wallet-icon">{w.icon}</div>
                  <div className="wallet-info">
                    <div className="wallet-name">{w.name}</div>
                    <div className="wallet-status">{w.desc}</div>
                  </div>
                  {selectedWallet === w.id && isConnecting ? (
                    <span className="spinner" />
                  ) : (
                    <span className="wallet-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="account-card">
              <div className="account-label">Connected Address</div>
              <div className="account-address">
                {connectedAddress.slice(0, 8)}...{connectedAddress.slice(-8)}
              </div>
              <div className="account-balance">
                <div>
                  <span className="balance-val">10,000</span>
                  <span className="balance-unit"> XLM</span>
                </div>
                <span className="wallet-icon" style={{ fontSize: 16 }}>
                  {WALLETS.find((w) => w.id === selectedWallet)?.icon ?? "🔗"}
                </span>
              </div>
              <button className="btn-disconnect" onClick={handleDisconnect}>
                Disconnect Wallet
              </button>
            </div>
          )}

          {error && (
            <div className="error-toast show">
              <div className="error-header">
                <span className="error-icon">⚠️</span>
                <span className="error-type">{error.type}</span>
              </div>
              <div className="error-desc">{error.msg}</div>
            </div>
          )}
        </div>
      </div>

      {/* Contract Info Panel */}
      <div className="glass-panel">
        <div className="panel-header">📋 Contract Info</div>
        <div className="panel-body">
          <div className="info-row">
            <span className="info-key">Network</span>
            <span className="info-val">Testnet</span>
          </div>
          <div className="info-row">
            <span className="info-key">Contract</span>
            <span className="info-val mono-sm">CCYUDN6J...77KS</span>
          </div>
          <div className="info-row">
            <span className="info-key">Total Votes</span>
            <span className="info-val">{totalVotes.toLocaleString()}</span>
          </div>
          {txStatus && (
            <div className={`tx-badge tx-${txStatus.status}`}>
              {txStatus.status === "pending" && "⏳ Transaction Pending…"}
              {txStatus.status === "success" && "✅ Vote Recorded On-Chain"}
              {txStatus.status === "failed" && `❌ Failed: ${txStatus.error}`}
              {txStatus.status === "success" && txStatus.txHash && (
                <a
                  className="tx-link"
                  href={`https://stellar.expert/explorer/testnet/tx/${txStatus.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Explorer ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vote Buttons Panel */}
      {connectedAddress && !hasVoted && (
        <div className="glass-panel">
          <div className="panel-header">🗳️ Cast Your Vote</div>
          <div className="panel-body">
            <div className="vote-options">
              {POLL_OPTIONS.map((opt, i) => {
                const pct = totalVotes > 0 ? Math.round((voteCounts[i] / totalVotes) * 100) : 0;
                return (
                  <button
                    key={i}
                    className={`vote-option${selectedOption === i ? " selected" : ""}`}
                    onClick={() => setSelectedOption(i)}
                    style={{ "--opt-color": opt.color } as React.CSSProperties}
                  >
                    <div
                      className="vote-bar"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${opt.color}33, ${opt.color}08)` }}
                    />
                    <div className="vote-content">
                      <div className={`vote-radio${selectedOption === i ? " sel" : ""}`} style={selectedOption === i ? { borderColor: opt.color, background: opt.color, boxShadow: `0 0 15px ${opt.color}66` } : {}} />
                      <span className="vote-text">{opt.label}</span>
                      <div className="vote-stats">
                        <div className="vote-pct" style={{ color: opt.color }}>{pct}%</div>
                        <div className="vote-count">{voteCounts[i]} votes</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="submit-area">
              <button
                className="btn-submit"
                disabled={selectedOption === null || isVoting}
                onClick={handleVote}
              >
                {isVoting ? "⏳ Submitting…" : "🗳️ Submit Vote"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Already Voted State */}
      {connectedAddress && hasVoted && (
        <div className="glass-panel voted-panel">
          <div className="panel-body" style={{ textAlign: "center", padding: "32px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Vote Submitted!</div>
            <div style={{ color: "#64748b", fontSize: 14 }}>
              You voted for <strong style={{ color: POLL_OPTIONS[votedOption!]?.color }}>
                {POLL_OPTIONS[votedOption!]?.label}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
