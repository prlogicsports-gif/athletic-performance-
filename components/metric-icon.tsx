import { MapPin, Gauge, Zap, Activity, Clock } from "lucide-react"

const map = {
  distance: MapPin,
  speed: Gauge,
  sprints: Zap,
  load: Activity,
  time: Clock,
}

export function MetricIcon({
  type,
  className,
}: {
  type: keyof typeof map
  className?: string
}) {
  const Icon = map[type]
  return <Icon className={className} strokeWidth={1.5} />
}
