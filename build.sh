#!/bin/bash
set -e

# Run OpenNext (which builds Next.js internally)
npx @opennextjs/cloudflare build

# Prepare Cloudflare Pages output directory
mkdir -p .worker-next

# Copy ALL OpenNext build artifacts (including .build directory)
cp -r .open-next/. .worker-next/

# Copy static assets to root of output dir
cp -r .open-next/assets/. .worker-next/

# Copy worker.js as _worker.js (Cloudflare Pages convention)
cp .open-next/worker.js .worker-next/_worker.js

# Remove cache from output directory
rm -rf .next/cache

echo "Build completed successfully, output in .worker-next"
