/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "saheedwale.s3.amazonaws.com",
      "ipalas3bucket.s3.us-east-2.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
