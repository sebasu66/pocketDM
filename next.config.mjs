/** @type {import('next').NextConfig} */
const baseConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const isProd = process.env.NODE_ENV === 'production';

export default (async () => {
  if (isProd) {
    try {
      const withPWAInit = (await import('next-pwa')).default;
      const withPWA = withPWAInit({
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        register: true,
        skipWaiting: true,
      });
      return withPWA(baseConfig);
    } catch (err) {
      console.warn('⚠️ Warning: next-pwa could not be loaded. Skipping PWA integration.', err);
    }
  }

  return baseConfig;
})();
