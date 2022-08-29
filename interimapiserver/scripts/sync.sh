#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

SCRIPTDIR=`dirname $0`

mkdir -p interimapiserver/src/{api,mocks/fixtures,types}

for filename in api/constants.ts mocks/fixtures/profileFixtures.ts mocks/fixtures/videosFixtures.ts types/enums.ts types/media.ts types/profile.ts; do
    sed -E -f $SCRIPTDIR/sync.sed < src/$filename > interimapiserver/src/$filename
done

