/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure API proxy for development
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig; 