/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "yahoofantasysports-res.cloudinary.com" },
      { hostname: "s.yimg.com" },
    ],
  },
  swcMinify: false, // Disable SWC minification temporarily
};

export default nextConfig;
