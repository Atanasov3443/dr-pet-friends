export function WavyBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top right pink blob */}
      <div 
        className="blob absolute -top-20 -right-20 w-[500px] h-[500px] opacity-60"
        style={{ backgroundColor: '#EF3988' }}
      />
      
      {/* Bottom left blue blob */}
      <div 
        className="blob absolute -bottom-32 -left-32 w-[600px] h-[600px] opacity-40"
        style={{ backgroundColor: '#0D67F7' }}
      />
      
      {/* Center right lime accent */}
      <svg 
        className="absolute top-1/3 right-0 w-[400px] h-[400px] opacity-70"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M350 200C350 280 290 340 200 350C120 360 50 300 40 220C30 140 80 70 160 50C240 30 320 80 350 160C360 180 360 190 350 200Z"
          fill="#DAF467"
        />
      </svg>
      
      {/* Decorative wavy lines */}
      <svg 
        className="absolute top-20 left-10 w-32 h-32 opacity-30"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M10 50C30 30 70 70 90 50"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10 60C30 40 70 80 90 60"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function HeroBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Pink wavy blob - top right */}
      <svg 
        className="absolute -top-20 -right-40 w-[700px] h-[700px]"
        viewBox="0 0 700 700"
        fill="none"
      >
        <path
          d="M600 150C680 220 700 350 650 450C600 550 480 620 350 600C220 580 120 500 80 380C40 260 80 140 180 80C280 20 420 40 520 100C570 130 590 140 600 150Z"
          fill="#EF3988"
          opacity="0.8"
        />
      </svg>
      
      {/* Blue wavy blob - bottom */}
      <svg 
        className="absolute -bottom-40 -left-20 w-[600px] h-[600px]"
        viewBox="0 0 600 600"
        fill="none"
      >
        <path
          d="M500 300C520 400 460 500 350 530C240 560 130 500 80 400C30 300 60 180 160 100C260 20 400 40 480 140C520 190 500 250 500 300Z"
          fill="#0D67F7"
          opacity="0.5"
        />
      </svg>
      
      {/* Lime accent blob */}
      <svg 
        className="absolute top-40 right-20 w-[300px] h-[300px]"
        viewBox="0 0 300 300"
        fill="none"
      >
        <path
          d="M250 150C260 200 220 260 150 270C80 280 20 230 10 160C0 90 50 30 120 20C190 10 240 60 250 130C255 145 255 150 250 150Z"
          fill="#DAF467"
          opacity="0.9"
        />
      </svg>
    </div>
  )
}
