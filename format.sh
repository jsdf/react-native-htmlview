#!/bin/bash

if [[ -z $1 ]]; then
  echo "Error: expected args"
  exit 1
fi
node_modules/.bin/prettier \
  "$@" \
  ./**/*.js
