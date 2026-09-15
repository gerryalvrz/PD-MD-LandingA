import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Chatbots sometimes lowercase URLs; static files on Vercel are case-sensitive.
    return [
      { source: "/skill.md", destination: "/SKILL.md", permanent: true },
      { source: "/Skill.md", destination: "/SKILL.md", permanent: true },
      { source: "/SKILL.MD", destination: "/SKILL.md", permanent: true },
    ];
  },
};

export default nextConfig;
