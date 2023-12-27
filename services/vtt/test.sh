#!/bin/bash
export  PGDATABASE="cube_content"
export PGHOST="34.130.166.14"
export PGPORT="5432"
export PGUSER="postgres"
export OPENAI="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"
export PGPASSWORD="JyJ79hWNJPVsvkxF8uQiHd22EYn7F4jKXYY3u8gWfno3WZRxMogfQD8qTydmayLVYKfs54BcMiEYHPYRKK2FHpX9yG2VFeFSrcxSo2jVjSMH9DUNqLkZvSf2bRusjdC7"
export cfToken="CLusczl7CRCmtlJx-fNEKMilmJf1O4vyEwpIePqb"
env 'CF-R2-SECRET=e301801c9172865569c50e39f0dd45c1f730572974ab9159f833b275a3ffc2d3' \
'CF-R2-ID=9fb7eb9a180cf8f1ea351be00da977ab' \
'CF-ACCOUNT-ID=812b8374abe5aa28e1ff4b96f82e1340' \
'CLOUDFLARE_R2_BUCKET_NAME=cubecommons-dev' \
'cfToken=CLusczl7CRCmtlJx-fNEKMilmJf1O4vyEwpIePqb' node test.mjs
