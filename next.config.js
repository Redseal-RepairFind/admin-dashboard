const { withNextVideo } = require("next-video/process");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ipalas3bucket.s3.us-east-2.amazonaws.com",
      "repairfindbucket.s3.eu-west-3.amazonaws.com",
      "/lh3.googleusercontent.com",
      "picsum.photos",
      "unsplash.com",
      "example.com",
    ], // Include other domains as needed

    remotePatterns: [
      {
        protocol: "https",
        hostname: "repairfindbucket.s3-eu-west-3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipalas3bucket.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore the 'fs' module in the client-side build
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = withNextVideo(nextConfig);

// (https://lh3.googleusercontent.com/a/
