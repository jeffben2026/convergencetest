#!/usr/bin/env bash
set -euo pipefail

cre simulate workflow/cre-workflow.yaml \
  --input '{"token":"ETH","chainId":11155111,"thresholdPct":1.0}'
