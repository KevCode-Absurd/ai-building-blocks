#!/usr/bin/env bash
# The original wrapper called scripts/meta-kit.sh from the full meta-ads-kit repo,
# which is not part of this package. This skill does not need it.
# Run the official Meta Ads CLI (`meta`) directly, read-only, as SKILL.md path B describes,
# with ACCESS_TOKEN and AD_ACCOUNT_ID set as environment variables. Or paste exported
# Ads Manager data (path A).

echo "This package has no run adapter. Use the official Meta Ads CLI directly (see SKILL.md, path B), or paste your Ads Manager export (path A)." >&2
exit 1
