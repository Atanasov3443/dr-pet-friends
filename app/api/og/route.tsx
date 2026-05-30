import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px", height: "630px",
          background: "linear-gradient(135deg, #1083BD 0%, #0d6fa0 50%, #EF3988 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, color: "white", fontWeight: 900, marginBottom: 16 }}>🐾</div>
        <div style={{ fontSize: 64, color: "white", fontWeight: 900, letterSpacing: -2 }}>Dr. Pet Friends</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)", marginTop: 16, textAlign: "center", maxWidth: 800 }}>
          Намерете ветеринар онлайн · Резервирайте за минути
        </div>
        <div style={{
          marginTop: 40, background: "rgba(255,255,255,0.15)", borderRadius: 100,
          padding: "12px 32px", color: "white", fontSize: 22, fontWeight: 600,
        }}>
          drpetfriends.bg
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
