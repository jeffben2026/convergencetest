const MODE = process.env.LLM_MODE || "stub";

export async function generateRiskSummary({ onchainPrice, externalPrice, thresholdPct }) {
  const deviationPct =
    (Math.abs(onchainPrice - externalPrice) / externalPrice) * 100;
  const exceedsThreshold = deviationPct >= thresholdPct;

  if (MODE !== "stub") {
    // Placeholder for real LLM call (OpenAI, Anthropic, etc.).
  }

  const summary = exceedsThreshold
    ? `Deviation ${deviationPct.toFixed(2)}% exceeds threshold. Investigate oracle.`
    : `Deviation ${deviationPct.toFixed(2)}% within acceptable range.`;

  return { summary, exceedsThreshold };
}
