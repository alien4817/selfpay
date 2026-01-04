import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 確保服務器端正確處理 @notionhq/client
      config.externals = config.externals || [];
    }
    return config;
  },
};

export default nextConfig;
