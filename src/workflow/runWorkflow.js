import "dotenv/config";
import { runCreWorkflow } from "../cre/adapter.js";

const input = {
  token: "ETH",
  chainId: 11155111,
  thresholdPct: 1.0,
};

runCreWorkflow(input)
  .then((result) => {
    console.log("Workflow result:", result);
  })
  .catch((error) => {
    console.error("Workflow failed:", error);
    process.exitCode = 1;
  });
