/** @type {import('next').NextConfig} */
const nextConfig = {
  // 強制重新部署
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // 快取控制
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 