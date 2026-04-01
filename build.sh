#!/bin/bash
set -e

# Build Next.js
npx next build

# Remove cache
rm -rf .next/cache

# Run OpenNext
npx @opennextjs/cloudflare
