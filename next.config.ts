import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove "output: export" to support API routes (Auth.js)
  // Cloudflare Pages via @cloudflare/next-on-pages handles edge deployment
};

export default nextConfig;
