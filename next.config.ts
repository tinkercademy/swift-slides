import type { NextConfig, Redirect } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tracks",
        permanent: false
      }
    ]
  }
}

export default nextConfig;
