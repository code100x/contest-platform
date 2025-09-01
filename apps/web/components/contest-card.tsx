"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Difficulty = "Easy" | "Medium" | "Hard"

export type ContestCardProps = {
  title: string
  description: string
  difficulty: Difficulty
  live?: boolean
  timeLeft?: string
  startsAt?: string
  className?: string
}

function DiffPill({ difficulty }: { difficulty: Difficulty }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1"
  const styles =
    difficulty === "Easy"
      ? "bg-secondary/15 text-foreground ring-secondary/30"
      : difficulty === "Medium"
        ? "bg-accent/15 text-foreground ring-accent/30"
        : "bg-primary/15 text-foreground ring-primary/30"

  return <span className={cn(base, styles)}>{difficulty}</span>
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function ContestCard({
  title,
  description,
  difficulty,
  live = false,
  timeLeft,
  startsAt,
  className,
}: ContestCardProps) {
  const [started, setStarted] = useState(false)
  const router = useRouter()
  const slug = slugify(title)

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/challenges/${slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          router.push(`/challenges/${slug}`)
        }
      }}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col outline-none transition-shadow duration-150 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      aria-label={`Open challenge ${title}`}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-pretty">{title}</CardTitle>
          <DiffPill difficulty={difficulty} />
        </div>
        <CardDescription className="text-pretty">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {live ? (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Live</span>
            {timeLeft ? ` • Ends in ${timeLeft}` : null}
          </p>
        ) : (
          startsAt && <p className="text-sm text-muted-foreground">Starts at {startsAt}</p>
        )}
        {started && <p className="text-sm text-muted-foreground">Status: In progress (mock)</p>}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="bg-primary text-primary-foreground transition-colors duration-150 hover:opacity-90 disabled:opacity-70"
          onClick={(e) => {
            e.stopPropagation()
            setStarted(true)
            router.push(`/challenges/${slug}`)
          }}
          disabled={started}
          aria-live="polite"
        >
          {started ? "In progress" : "Start challenge"}
        </Button>
      </CardFooter>
    </Card>
  )
}
