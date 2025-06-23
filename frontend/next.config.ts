import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      "https://backend-miltrack-production.up.railway.app",
  },
  /* config options here */
};

export default nextConfig;
