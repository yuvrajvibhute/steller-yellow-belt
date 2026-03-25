import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StarVote — Live Poll on Stellar",
  description: "Cast your vote on-chain with Stellar Soroban smart contracts. Multi-wallet support, real-time results, and live activity feed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
