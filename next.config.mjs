/** @type {import('next').NextConfig'} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  allowedDevOrigins: [
    '192.168.88.194',
  ],
}

export default nextConfig