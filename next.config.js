/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.scdn.co'], // Allow loading images from Spotify's CDN
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 