#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

export PGUSER=postgres
export PGPASSWORD=postgres
export PGHOST=localhost
export PGPORT=5432

export PGDATABASE=cube_identity
psql \
postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE} \
--command="TRUNCATE users;"

export PGDATABASE=cube_profile
psql \
postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE} \
--command="TRUNCATE profiles;"