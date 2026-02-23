import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // turbopack: {}, // Desabilitado - usando SWC compiler
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
