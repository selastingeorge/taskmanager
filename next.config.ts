import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable linting during the build process
  },
  env:{
    apiUrl:'https://taskmanagerbackend.pythonanywhere.com/'
  }
};

export default nextConfig;
