import { setupDevPlatform } from '@opennextjs/cloudflare'

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
