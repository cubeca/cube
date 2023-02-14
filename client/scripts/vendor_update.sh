#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

# CURRENT_VENDOR_VERSION=`npm view ./vendor/@cubeca/bff-client-oas-axios version 2>/dev/null || echo "unknown"`
# LATEST_PUBLISHED_VERSION=`npm view @cubeca/bff-client-oas-axios version 2>/dev/null || echo "unknown"`
#
# echo "LATEST_PUBLISHED_VERSION=$LATEST_PUBLISHED_VERSION"
# echo "CURRENT_VENDOR_VERSION=$CURRENT_VENDOR_VERSION"

STAGING_DIR="${VENDOR_UPDATE_STAGING_DIR:-./vendor-staging/}"

mkdir -p "$STAGING_DIR"
pushd "$STAGING_DIR"

cat > ./package.json <<END_OF_PACKAGE_JSON
{
  "name": "cube-ui-fe-vendor-staging",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "@cubeca/bff-auth-client-oas-axios": "*",
    "@cubeca/bff-client-oas-axios": "*"
  }
}
END_OF_PACKAGE_JSON

npm install
cp -rp ./node_modules/@cubeca/bff-auth-client-oas-axios ../vendor/@cubeca/
cp -rp ./node_modules/@cubeca/bff-client-oas-axios ../vendor/@cubeca/

popd
rm -rf "$STAGING_DIR"
