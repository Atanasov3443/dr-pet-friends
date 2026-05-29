export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1083BD]">
      <svg className="w-20 h-20 bone-spin" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(-45 50 50)">
          <rect x="44" y="19" width="12" height="62" rx="6" />
          <circle cx="37" cy="25" r="14" />
          <circle cx="63" cy="25" r="14" />
          <circle cx="37" cy="75" r="14" />
          <circle cx="63" cy="75" r="14" />
        </g>
      </svg>
      <p className="text-white/80 mt-5 font-semibold text-lg tracking-wide">Зарежда...</p>
    </div>
  )
}
