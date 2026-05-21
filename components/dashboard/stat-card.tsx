import { TrendingUp, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    label: string
  }
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium leading-5 text-text-tertiary">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight text-text-primary">
              {value}
            </p>
            {subtitle && (
              <span className="text-sm font-medium leading-5 text-text-muted">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 transition-colors duration-300 group-hover:bg-brand-primary/20">
          <Icon className="size-5 text-brand-primary" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 border-t border-border-light pt-4">
          <Badge variant="success">
            <TrendingUp />
            {trend.value}
          </Badge>
          <span className="text-xs leading-4 text-text-muted">
            {trend.label}
          </span>
        </div>
      )}
    </Card>
  )
}
