// next.config.mjs (for ES modules)
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'sin1.contabostorage.com',
      },
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
      },
    ],
  },
};
