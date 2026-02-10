# 功能：此文件包含与以太坊区块链交互的功能，包括获取链上价格和提交判决。

import { ethers } from "ethers";

# 从环境变量中获取配置信息
const RPC_URL = process.env.SEPOLIA_RPC_URL; # Sepolia RPC URL
const PRICE_ORACLE_ADDRESS = process.env.PRICE_ORACLE_ADDRESS; # 价格预言机合约地址
const PRIVATE_KEY = process.env.PRIVATE_KEY; # 用于交易签名的私钥

# 价格预言机合约的 ABI (Application Binary Interface)
# 定义了合约中我们将要调用的函数接口
const ORACLE_ABI = [
  "function latestAnswer() view returns (int256)", # 获取最新价格的视图函数
  "function submitVerdict(uint256 deviationPct, string riskSummary)" # 提交判决的函数
];

# 功能：从链上价格预言机获取最新价格。
# 参数：
#   - chainId: 区块链 ID。
# 返回值：最新的链上价格 (以浮点数表示)，如果配置不完整则返回 0。
export async function fetchOnchainPrice(chainId) {
  # 如果 RPC_URL 或 PRICE_ORACLE_ADDRESS 未配置，则返回 0
  if (!RPC_URL || !PRICE_ORACLE_ADDRESS) {
    console.warn("Missing RPC_URL or PRICE_ORACLE_ADDRESS, skipping on-chain price fetch.");
    return 0;
  }
  # 创建 JSON RPC 提供者
  const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);
  # 实例化预言机合约
  const oracle = new ethers.Contract(PRICE_ORACLE_ADDRESS, ORACLE_ABI, provider);
  # 调用 latestAnswer 函数获取价格
  const price = await oracle.latestAnswer();
  # 返回转换后的价格 (将 int256 除以 1e8 得到浮点数)
  return Number(price) / 1e8;
}

# 功能：向链上提交判决结果。
# 参数：
#   - chainId: 区块链 ID。
#   - deviationPct: 价格偏差百分比。
#   - riskSummary: 风险摘要字符串。
# 返回值：交易收据，如果配置不完整则返回 { skipped: true }。
export async function submitVerdict({ chainId, deviationPct, riskSummary }) {
  # 如果 RPC_URL, PRICE_ORACLE_ADDRESS 或 PRIVATE_KEY 未配置，则跳过提交
  if (!RPC_URL || !PRICE_ORACLE_ADDRESS || !PRIVATE_KEY) {
    console.warn("Missing RPC_URL, PRICE_ORACLE_ADDRESS, or PRIVATE_KEY, skipping on-chain verdict submission.");
    return { skipped: true };
  }
  # 创建 JSON RPC 提供者
  const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);
  # 使用私钥创建钱包实例
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  # 使用钱包连接到预言机合约，以便可以发送交易
  const oracle = new ethers.Contract(PRICE_ORACLE_ADDRESS, ORACLE_ABI, wallet);
  # 调用 submitVerdict 函数并发送交易
  # 注意：deviationPct 被乘以 100 并取整，以适应 Solidity 中的 uint256 类型
  const tx = await oracle.submitVerdict(Math.round(deviationPct * 100), riskSummary);
  # 等待交易被挖矿并返回收据
  return tx.wait();
}
