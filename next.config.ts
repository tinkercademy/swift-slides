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
      // https://explore.swiftin.sg/codingclub/a -> https://explore.swiftin.sg/tracks/track_a
      // https://explore.swiftin.sg/codingclub/a/presentation.html?deck=apple-keynote#/slide-view -> https://explore.swiftin.sg/tracks/track_a/unit_01#/slide-view
      {
        source: "/codingclub/:track([abcx])/:presentation*",
        destination: "/tracks/track_:track",
        permanent: false
      },
    ]
  }
}

export default nextConfig;
