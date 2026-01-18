/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Disable source maps in production to reduce memory usage
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // API configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Webpack configuration for Docker
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Reduce memory usage during build
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };

    // Disable cache to reduce memory
    config.cache = false;

    return config;
  },

  // Experimental features for memory optimization
  experimental: {
    // Reduce memory by not creating workers
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;