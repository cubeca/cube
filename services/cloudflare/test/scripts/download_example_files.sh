#!/usr/bin/env bash

# Make Bash's error handling strict(er).
set -o nounset -o pipefail -o errexit

HERE=`dirname "$0"`

EXAMPLE_FILE_DIR=`realpath "$HERE/../example-files"`

while read example_file_url; do
  filename=`basename $example_file_url`
  filepath="$EXAMPLE_FILE_DIR/$filename"
  if [ -f "$filepath" ]; then
    echo "example file $filepath exists already, no need to download"
  else
    echo "downloading example file $filepath"
    curl $example_file_url > $filepath
  fi
done <<EOF
https://file-examples.com/storage/fe21053bab6446bba9a0947/2017/04/file_example_MP4_480_1_5MG.mp4
https://file-examples.com/storage/fe43a59c1d63fdf2d99c5d2/2017/11/file_example_MP3_700KB.mp3
EOF
