#!/bin/bash
set -e

# Run OpenNext (which builds Next.js internally)
npx @opennextjs/cloudflare build

# Prepare Cloudflare Pages output directory
# Pages expects: static files at root + _worker.js for the Worker
mkdir -p .worker-next

# Copy static assets to root of output dir
cp -r .open-next/assets/. .worker-next/

# Copy worker.js as _worker.js (Cloudflare Pages convention)
cp .open-next/worker.js .worker-next/_worker.js

# Remove cache from output directory
rm -rf .next/cache
