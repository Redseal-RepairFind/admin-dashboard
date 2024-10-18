/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "ipalas3bucket.s3.us-east-2.amazonaws.com",
      "repairfindbucket.s3.eu-west-3.amazonaws.com",
    ], // Include other domains as needed

    remotePatterns: [
      {
        protocol: "https",
        hostname: "repairfindbucket.s3-eu-west-3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
