# SentinelCRE: Cross-Source Price Sentinel

SentinelCRE is a new hackathon project that uses **Chainlink CRE** as the orchestration layer to verify on-chain pricing against external market data and an LLM-driven risk summary. The workflow integrates **Ethereum Sepolia** (blockchain), **CoinGecko** (external API), and a lightweight **LLM agent** to generate a compliance summary, then optionally writes a signed verdict back on-chain.

## Architecture
```
Ethereum (Sepolia) -> Chainlink CRE -> External API (CoinGecko)
                               -> LLM Agent (risk summary)
                               -> Verdict (optional on-chain write)
```

## Repository layout
- `workflow/cre-workflow.yaml` — CRE workflow definition.
- `src/cre/adapter.js` — CRE adapter wiring the workflow to local JS tasks.
- `src/blockchain/ethereum.js` — on-chain read/write helpers.
- `src/external/coingecko.js` — external API fetcher.
- `src/agents/llmAgent.js` — LLM risk summary.
- `src/workflow/runWorkflow.js` — local simulation runner.

## Quick start (local simulation)
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Set environment variables**
   ```bash
   cp .env.example .env
   # edit values as needed
   ```
3. **Run the JS simulation (without CRE CLI)**
   ```bash
   npm run simulate
   ```

## CRE CLI simulation
> This demonstrates a CRE CLI simulation of the workflow definition.

```bash
cre simulate workflow/cre-workflow.yaml \
  --input '{"token":"ETH","chainId":11155111,"thresholdPct":1.0}'
```

## CRE network deployment (optional)
```bash
cre deploy workflow/cre-workflow.yaml
```

## Hackathon submission checklist
- **3–5 min video:** _Add your public video link here._
- **Public repo:** this repository.
- **README links to all Chainlink files:** see below.

## Files that use Chainlink
- `workflow/cre-workflow.yaml`
- `src/cre/adapter.js`
- `src/blockchain/ethereum.js`
- `src/workflow/runWorkflow.js`

## Notes
- This project is newly created for the hackathon. It is not a resubmission of a prior entry.
