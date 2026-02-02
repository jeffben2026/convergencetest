import { ethers } from "ethers";

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRICE_ORACLE_ADDRESS = process.env.PRICE_ORACLE_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ORACLE_ABI = [
  "function latestAnswer() view returns (int256)",
  "function submitVerdict(uint256 deviationPct, string riskSummary)"
];

export async function fetchOnchainPrice(chainId) {
  if (!RPC_URL || !PRICE_ORACLE_ADDRESS) {
    return 0;
  }
  const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);
  const oracle = new ethers.Contract(PRICE_ORACLE_ADDRESS, ORACLE_ABI, provider);
  const price = await oracle.latestAnswer();
  return Number(price) / 1e8;
}

export async function submitVerdict({ chainId, deviationPct, riskSummary }) {
  if (!RPC_URL || !PRICE_ORACLE_ADDRESS || !PRIVATE_KEY) {
    return { skipped: true };
  }
  const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const oracle = new ethers.Contract(PRICE_ORACLE_ADDRESS, ORACLE_ABI, wallet);
  const tx = await oracle.submitVerdict(Math.round(deviationPct * 100), riskSummary);
  return tx.wait();
}
