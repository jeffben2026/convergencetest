# 功能：此文件包含 Chainlink CRE 工作流的适配器逻辑。
# 它协调从区块链、外部 API 获取数据，生成风险摘要，并根据需要提交链上判决。

import { fetchOnchainPrice, submitVerdict } from "../blockchain/ethereum.js";
import { fetchExternalPrice } from "../external/coingecko.js";
import { generateRiskSummary } from "../agents/llmAgent.js";

# 功能：运行 CRE 工作流的主函数。
# 参数：
#   - token: 要查询的代币符号 (e.g., "ETH")。
#   - chainId: 对应的区块链 ID。
#   - thresholdPct: 价格偏差的阈值百分比。
# 返回值：包含链上价格、外部价格、偏差百分比和风险摘要的对象。
export async function runCreWorkflow({ token, chainId, thresholdPct }) {
  # 从区块链获取链上价格
  const onchainPrice = await fetchOnchainPrice(chainId);
  # 从外部 API (CoinGecko) 获取外部价格
  const externalPrice = await fetchExternalPrice(token);

  # 使用 LLM 代理生成风险摘要
  const risk = await generateRiskSummary({
    onchainPrice,
    externalPrice,
    thresholdPct,
  });

  # 计算链上价格和外部价格之间的偏差百分比
  const deviationPct =
    (Math.abs(onchainPrice - externalPrice) / externalPrice) * 100;

  # 如果风险摘要显示超出阈值，则提交链上判决
  if (risk.exceedsThreshold) {
    await submitVerdict({
      chainId,
      deviationPct,
      riskSummary: risk.summary,
    });
  }

  # 返回工作流的结果
  return {
    onchainPrice,
    externalPrice,
    deviationPct,
    risk,
  };
}
