import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Xuất Next.js thành static site (SSG)
    eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    unoptimized: true, // Bắt buộc nếu dùng ảnh, tránh lỗi khi export
  },
};

export default nextConfig;
