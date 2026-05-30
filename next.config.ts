import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: '/reservar',
        destination: 'https://oz-med.vercel.app/reservar/hildadiaz',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
