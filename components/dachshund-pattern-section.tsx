"use client"

const rows = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
]

export function DachshundPatternSection() {
  return (
    <div className="w-full overflow-hidden bg-white py-10 select-none pointer-events-none">
      <div className="flex flex-col gap-6">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex gap-10 items-center"
            style={{ paddingLeft: ri % 2 === 1 ? "96px" : "24px" }}
          >
            {[...row, ...row].map((_, i) => (
              <img
                key={i}
                src="/dachshund.jpg"
                alt=""
                className="shrink-0 w-24 h-auto opacity-15"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
