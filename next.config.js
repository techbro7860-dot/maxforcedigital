/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/digital-courses", destination: "/shop?category=courses", permanent: true },
      { source: "/product-category/courses", destination: "/shop?category=courses", permanent: true },
      { source: "/product-category/digital-e-book", destination: "/shop?category=digital-e-book", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/my-account", destination: "/account", permanent: true },
      { source: "/return-and-refund-policy", destination: "/refund-policy", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/cookie-policy", destination: "/privacy-policy", permanent: true },
      { source: "/best-it-solution-company-in-noida", destination: "/", permanent: true },
      { source: "/offerspage", destination: "/shop", permanent: true },
      { source: "/thank-you", destination: "/", permanent: true },
      { source: "/courses-page", destination: "/shop?category=courses", permanent: true },
      { source: "/course-:id(2|3|4|5|6|7|8|9|10)", destination: "/shop?category=courses", permanent: true },
    ];
  },
};

module.exports = nextConfig;
