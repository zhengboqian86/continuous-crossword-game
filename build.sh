#!/bin/bash
set -e

# Run OpenNext (which builds Next.js internally)
npx @opennextjs/cloudflare build

# Remove cache from output directory
rm -rf .worker-next/.next/cache
