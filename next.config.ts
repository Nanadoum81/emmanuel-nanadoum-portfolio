import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist', '@napi-rs/canvas'],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 2000],
  },
  outputFileTracingIncludes: { "/opengraph-image": ["./assets/fonts/**"], "/api/knowledgeos/workspace": ["./node_modules/pdfjs-dist/package.json", "./node_modules/pdfjs-dist/legacy/build/**", "./node_modules/pdfjs-dist/standard_fonts/**", "./node_modules/pdfjs-dist/cmaps/**", "./node_modules/@napi-rs/canvas/**", "./node_modules/@napi-rs/canvas-linux-x64-gnu/**"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/work/palmer", destination: "/work/palmer-herman", permanent: true },
      { source: "/Emmanuel_Nanadoum_Sales_Engineer_Resume.pdf", destination: "/Emmanuel_Nanadoum_Solutions_Engineer_Resume.pdf", permanent: true },
      { source: "/demos", destination: "/solutions", permanent: true },
      { source: "/demos/:slug", destination: "/solutions/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
