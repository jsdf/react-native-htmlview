#!/bin/bash
node_modules/.bin/prettier \
  $@ \
  --bracket-spacing=false \
  --trailing-comma=es5 \
  --single-quote=true \
  ./**/*.js
