export async function fetchExternalPrice(token) {
  const tokenId = token.toLowerCase() === "eth" ? "ethereum" : token;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CoinGecko error: ${response.status}`);
  }
  const data = await response.json();
  return Number(data[tokenId]?.usd ?? 0);
}
