#!/bin/bash
node_modules/.bin/prettier \
  $@ \
  --bracket-spacing=false \
  --trailing-comma=none \
  --single-quote=true \
  ./**/*.js
