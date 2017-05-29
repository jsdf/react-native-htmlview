#!/bin/bash

if [[ -z $1 ]]; then
  echo "Error: expected args"
  exit 1
fi
node_modules/.bin/prettier \
  "$@" \
  --bracket-spacing=false \
  --trailing-comma=es5 \
  --single-quote=true \
  ./**/*.js
