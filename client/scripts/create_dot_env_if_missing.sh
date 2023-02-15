#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

if [ ! -e ./.env ]; then
  # In theory the `-n` CLI switch of cp should've been enough, but it's not
  # widely known, so it looks too scary directly in package.json
  # Also, with this shell script, we can wrap another safety check around `cp -n`
  cp -n ./.env.example ./.env
fi
