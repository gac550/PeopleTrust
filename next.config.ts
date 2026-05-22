import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: true,  // fix iframes /preview/ — evita 308 a /preview sin slash
}

export default nextConfig
