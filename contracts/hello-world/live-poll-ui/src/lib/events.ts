export async function fetchFeedbackEvents(contractId: string) {
  try {
    // Mock events for demo
    return [
      { value: "Great dApp experience!" },
      { value: "Smooth wallet integration" },
      { value: "Love the real-time updates" },
    ];
  } catch {
    return [];
  }
}
