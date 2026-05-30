import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev"

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform()
}

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options",    value: "nosniff"      },
  { key: "X-Frame-Options",           value: "SAMEORIGIN"   },
  { key: "X-XSS-Protection",          value: "1; mode=block"},
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === "edge") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        net: false,
        tls: false,
        dns: false,
        crypto: false,
      }
    }
    return config
  },
}

export default nextConfig
