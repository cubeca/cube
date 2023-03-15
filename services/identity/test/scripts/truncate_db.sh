#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

psql \
postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE} \
--command="TRUNCATE users, profiles;"
