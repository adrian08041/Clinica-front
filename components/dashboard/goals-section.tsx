"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GoalProgress } from "@/lib/types"

const PROGRESS_STYLES: Record<
  GoalProgress["variant"],
  { indicator: string; text: string }
> = {
  brand: {
    indicator: "[&>[data-slot=progress-indicator]]:bg-brand-primary",
    text: "text-brand-primary",
  },
  warning: {
    indicator: "[&>[data-slot=progress-indicator]]:bg-warning-accent",
    text: "text-warning-accent",
  },
}

function GoalProgressBar({ goal }: { goal: GoalProgress }) {
  const styles = PROGRESS_STYLES[goal.variant]

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-text-tertiary text-xs leading-4">
          {goal.label}
        </span>
        <span className={`font-medium text-xs leading-4 ${styles.text}`}>
          {goal.current} / {goal.target}
        </span>
      </div>
      <Progress
        value={goal.percentage}
        className={`h-2 bg-white border border-border-light ${styles.indicator}`}
      />
    </div>
  )
}

interface GoalsSectionProps {
  title: string
  goals: GoalProgress[]
}

export function GoalsSection({ title, goals }: GoalsSectionProps) {
  return (
    <Card className="gap-4 p-6 md:p-8 flex-1">
      <CardHeader className="p-0">
        <CardTitle className="text-text-primary text-lg leading-7">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-4 mt-1">
        {goals.map((goal) => (
          <GoalProgressBar key={goal.label} goal={goal} />
        ))}
      </CardContent>
    </Card>
  )
}
