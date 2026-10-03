/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Upload foto lewat Server Action (batas Vercel 4.5 MB per request).
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
