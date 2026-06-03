import { MetadataRoute } from "next"

const BASE = "https://dr-pet-friends.pages.dev"
const API  = process.env.NEXT_PUBLIC_API_URL ?? "https://dr-pet-friends-1.onrender.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/search`,              lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/login`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/apply`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,               lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ]

  // Dynamic vet profiles
  try {
    const res = await fetch(`${API}/api/vets`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const vets = await res.json()
      const vetRoutes: MetadataRoute.Sitemap = (Array.isArray(vets) ? vets : []).map((v: any) => ({
        url:             `${BASE}/vet/${v.id}`,
        lastModified:    new Date(v.updatedAt ?? new Date()),
        changeFrequency: "weekly" as const,
        priority:        0.8,
      }))
      return [...staticRoutes, ...vetRoutes]
    }
  } catch { /* return static only */ }

  return staticRoutes
}
