#!/bin/bash
set -e

# Run OpenNext (which builds Next.js internally)
npx @opennextjs/cloudflare

# Remove cache from output directory
rm -rf .worker-next/.next/cache
