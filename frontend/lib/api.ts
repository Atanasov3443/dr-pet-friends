export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export function apiUrl(path: string): string {
  if (typeof window !== "undefined") {
    return `/api/proxy${path}`
  }
  return `${API_URL}${path}`
}
