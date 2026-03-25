"use client";

import React, { useState, useEffect, useCallback } from "react";
import { fetchFeedbackEvents } from "../lib/events";
import { CONTRACT_ID } from "../lib/contract";

interface FeedItem {
  id: string;
  text: string;
  time: string;
  type: "vote" | "connect" | "event";
}

const VOTE_LABELS = ["Option A", "Option B", "Option C"];
const VOTE_COLORS = ["#00f2fe", "#8e2de2", "#f59e0b"];
const VOTE_ICONS = ["🔵", "🟣", "🟡"];

function ts() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export default function ActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>([
    {
      id: "init",
      text: "Live feed initialised — polling every 5s",
      time: ts(),
      type: "event",
    },
  ]);
  const [lastPoll, setLastPoll] = useState<string>(ts());
  const [isPolling, setIsPolling] = useState(false);

  const poll = useCallback(async () => {
    setIsPolling(true);
    try {
      const events = await fetchFeedbackEvents(CONTRACT_ID);
      const newItems: FeedItem[] = events.map((e, i) => ({
        id: `${Date.now()}-${i}`,
        text: e.value,
        time: ts(),
        type: "event",
      }));
      if (newItems.length > 0) {
        setItems((prev) => [...newItems.reverse(), ...prev].slice(0, 30));
      }
      setLastPoll(ts());
    } catch {
      // silently ignore poll errors
    } finally {
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [poll]);

  // Expose a way for parents to push new vote events
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { option, address, txHash } = e.detail as { option: number; address: string; txHash: string };
      const item: FeedItem = {
        id: `vote-${Date.now()}`,
        text: `${shortAddr(address)} voted for ${VOTE_LABELS[option]} → ${txHash ? txHash.slice(0, 10) + "…" : "pending"}`,
        time: ts(),
        type: "vote",
      };
      setItems((prev) => [item, ...prev].slice(0, 30));
    };
    window.addEventListener("live-poll:vote" as any, handler);
    return () => window.removeEventListener("live-poll:vote" as any, handler);
  }, []);

  return (
    <div className="glass-panel feed-panel">
      <div className="panel-header feed-header-row">
        <span>📡 Live Activity Feed</span>
        <span className={`poll-indicator${isPolling ? " polling" : ""}`}>
          <span className="live-dot" />
          {isPolling ? "Polling…" : `Last: ${lastPoll}`}
        </span>
      </div>
      <div className="feed-body">
        {items.length === 0 ? (
          <div className="feed-empty">No activity yet — cast a vote to see it appear here!</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={`feed-item feed-${item.type}`}>
              <span className="feed-time">{item.time}</span>
              <span className="feed-dot">›</span>
              <span className="feed-text">{item.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/** Helper: dispatch a vote event that ActivityFeed listens to */
export function dispatchVoteEvent(option: number, address: string, txHash: string) {
  window.dispatchEvent(
    new CustomEvent("live-poll:vote", { detail: { option, address, txHash } })
  );
}
