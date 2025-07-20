/** @type {import('next').NextConfig} */
const nextConfig = {
  buildId: `build-${Date.now()}-no-checkbox`,
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 