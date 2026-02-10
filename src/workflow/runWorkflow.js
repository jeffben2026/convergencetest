# 功能：此文件是本地模拟运行 Chainlink CRE 工作流的入口点。
# 它加载环境变量，定义工作流输入，并调用适配器函数来执行工作流。

import "dotenv/config";
import { runCreWorkflow } from "../cre/adapter.js";

# 定义工作流的输入参数
const input = {
  token: "ETH", # 要查询的代币符号
  chainId: 11155111, # 对应的区块链 ID (例如，Sepolia 测试网)
  thresholdPct: 1.0, # 价格阈值百分比
};

# 执行 CRE 工作流
runCreWorkflow(input)
  .then((result) => {
    # 功能：工作流成功完成后，打印结果
    console.log("Workflow result:", result);
  })
  .catch((error) => {
    # 功能：如果工作流执行失败，打印错误信息并设置退出码
    console.error("Workflow failed:", error);
    process.exitCode = 1;
  });
