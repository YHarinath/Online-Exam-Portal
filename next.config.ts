import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcrypt"],
  turbopack: {},
};

export default nextConfig;
