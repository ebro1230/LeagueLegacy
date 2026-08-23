/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "yahoofantasysports-res.cloudinary.com" },
      { hostname: "s.yimg.com" },
      { hostname: "763445962456-brand-assets.s3.us-west-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
