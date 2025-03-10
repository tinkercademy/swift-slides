import type { NextConfig, Redirect } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tracks",
        permanent: false
      },
      {
        source: "/codingclub",
        destination: "/tracks",
        permanent: false
      },
      {
        source: "/codingclub/:slug([abcx])",
        destination: "/tracks/track_:slug",
        permanent: false
      },
    ]
  }
}

export default nextConfig;
