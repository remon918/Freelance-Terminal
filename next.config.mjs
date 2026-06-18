/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // এটি দিয়ে পৃথিবীর যেকোনো HTTPS ডোমেইনের ইমেজ লোড হবে
      },
      {
        protocol: 'http',
        hostname: '**', // এটি দিয়ে যেকোনো HTTP ডোমেইনের ইমেজও লোড হবে
      },
    ],
  },
};

export default nextConfig;