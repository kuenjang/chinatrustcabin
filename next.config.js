/** @type {import('next').NextConfig} */
const nextConfig = {
  buildId: `build-${Date.now()}`,
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 