// @ts-check
/// <reference types="@prisma/client" />

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://172.25.64.1',
    'http://10.0.2.2',
    'http://localhost',
  ],
};

export default nextConfig;
