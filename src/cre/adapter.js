import { fetchOnchainPrice, submitVerdict } from "../blockchain/ethereum.js";
import { fetchExternalPrice } from "../external/coingecko.js";
import { generateRiskSummary } from "../agents/llmAgent.js";

export async function runCreWorkflow({ token, chainId, thresholdPct }) {
  const onchainPrice = await fetchOnchainPrice(chainId);
  const externalPrice = await fetchExternalPrice(token);
  const risk = await generateRiskSummary({
    onchainPrice,
    externalPrice,
    thresholdPct,
  });

  const deviationPct =
    (Math.abs(onchainPrice - externalPrice) / externalPrice) * 100;

  if (risk.exceedsThreshold) {
    await submitVerdict({
      chainId,
      deviationPct,
      riskSummary: risk.summary,
    });
  }

  return {
    onchainPrice,
    externalPrice,
    deviationPct,
    risk,
  };
}
