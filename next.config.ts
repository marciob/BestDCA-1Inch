//next.config.ts
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ① dev-server & prod build may read files outside the app dir
  experimental: { externalDir: true },

  // ② create the same alias for Webpack (Turbopack reads tsconfig)
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@contracts": path.resolve(__dirname, "../contracts"),
    };
    return config;
  },
};

export default nextConfig;
