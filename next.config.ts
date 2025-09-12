import type { NextConfig, Redirect } from "next";

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enable compression
  compress: true,
  
  async headers() {
    return [
      {
        source: '/:path*\\.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/covers/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tracks",
        permanent: false
      },
      // Temporary redirects for legacy presentation links from old HTML website (additional workaround code in src/app/tracks/[trackId]/page.tsx)
      // https://explore.swiftin.sg/codingclub -> https://explore.swiftin.sg/tracks
      // https://explore.swiftin.sg/codingclub/a -> https://explore.swiftin.sg/tracks/track_a
      // https://explore.swiftin.sg/codingclub/a/presentation.html?deck=apple-keynote#/slide-view -> https://explore.swiftin.sg/tracks/track_a/unit_01#/slide-view
      {
        source: "/codingclub",
        destination: "/tracks",
        permanent: false
      },
      {
        source: "/codingclub/:track([abcx])/:presentation*",
        destination: "/tracks/track_:track",
        permanent: false
      },
    ]
  }
}

export default nextConfig;
