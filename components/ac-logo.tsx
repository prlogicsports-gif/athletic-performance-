import { cn } from "@/lib/utils"

function Star({ x, y, s }: { x: number; y: number; s: number }) {
  // 5-point star outline centred at (x,y) with radius s
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? s : s * 0.42
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${x + r * Math.cos(a)},${y + r * Math.sin(a)}`)
  }
  return <polygon points={pts.join(" ")} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" />
}

export function AcLogo({
  className,
  withRunner = false,
}: {
  className?: string
  withRunner?: boolean
}) {
  return (
    <svg
      viewBox="0 0 200 110"
      className={cn("text-foreground", className)}
      fill="none"
      aria-label="Athletic Club"
    >
      {/* stars arc */}
      <g transform={withRunner ? "translate(-18,0)" : "translate(0,0)"}>
        <Star x={70} y={22} s={11} />
        <Star x={100} y={14} s={13} />
        <Star x={130} y={22} s={11} />
        {/* AC outlined letters */}
        <text
          x={withRunner ? 96 : 100}
          y={92}
          textAnchor="middle"
          fontSize={78}
          fontWeight={900}
          fontStyle="italic"
          fontFamily="var(--font-geist-sans), system-ui, sans-serif"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinejoin="round"
          letterSpacing="-4"
        >
          AC
        </text>
      </g>

      {withRunner && (
        <g stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* head */}
          <circle cx={158} cy={50} r={5} fill="currentColor" stroke="none" />
          {/* torso */}
          <path d="M150 70 L165 60" />
          {/* arms */}
          <path d="M157 64 L168 58 M157 64 L146 70" />
          {/* legs */}
          <path d="M150 70 L142 86 M150 70 L162 80 L168 92" />
        </g>
      )}
    </svg>
  )
}
