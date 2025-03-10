import type { NextConfig, Redirect } from "next";

const nextConfig: NextConfig = {
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
