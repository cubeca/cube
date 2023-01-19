#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

SUBDIR=$1
GITHUB_TOKEN=$2
REPOSITORY_OWNER=$3

cd ./$SUBDIR
printf "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN\n@$REPOSITORY_OWNER:registry=https://npm.pkg.github.com" > ./.npmrc
