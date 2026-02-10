# 功能：此文件包含从 CoinGecko 外部 API 获取代币价格的功能。

# 功能：从 CoinGecko 获取指定代币的当前美元价格。
# 参数：
#   - token: 代币的符号 (例如，"ETH")。
# 返回值：代币的美元价格 (浮点数)。
# 抛出异常：如果 API 请求失败，则抛出错误。
export async function fetchExternalPrice(token) {
  # 将代币符号转换为 CoinGecko 的内部 ID。
  # 注意："ETH" 特殊处理为 "ethereum"。
  const tokenId = token.toLowerCase() === "eth" ? "ethereum" : token;
  
  # 构建 CoinGecko API 请求 URL。
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;
  
  # 发送 API 请求。
  const response = await fetch(url);
  
  # 检查响应是否成功。
  if (!response.ok) {
    throw new Error(`CoinGecko error: ${response.status}`);
  }
  
  # 解析 JSON 响应。
  const data = await response.json();
  
  # 从响应中提取美元价格。如果价格不存在，则默认为 0。
  return Number(data[tokenId]?.usd ?? 0);
}
