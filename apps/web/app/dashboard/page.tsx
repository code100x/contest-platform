"use client"

import { useEffect, useState } from "react"
import { ContestCard } from "@/components/contest-card"
import axios from "axios"
import { BACKEND_URL } from "@/config"

const challenges = [
  {
    title: "Array Utilities",
    description: "Implement map, filter, and reduce in TypeScript.",
    difficulty: "Easy" as const,
    live: true,
    timeLeft: "1h 20m",
    startsAt: "11:00 AM",
  },
  {
    title: "Auth Middleware",
    description: "Create a secure middleware with rate-limit.",
    difficulty: "Medium" as const,
    live: true,
    timeLeft: "50m",
    startsAt: "12:30 PM",
  },
  {
    title: "SQL Indexing",
    description: "Optimize a slow query plan with proper indexes.",
    difficulty: "Hard" as const,
    live: false,
    startsAt: "2:00 PM",
  },
  {
    title: "Webhooks Handler",
    description: "Build an idempotent webhook receiver.",
    difficulty: "Medium" as const,
    live: false,
    startsAt: "3:15 PM",
  },
  {
    title: "UI State Machine",
    description: "Model a wizard flow with state machines.",
    difficulty: "Hard" as const,
    live: false,
    startsAt: "4:00 PM",
  },
  {
    title: "Image Optimization",
    description: "Serve responsive images with caching.",
    difficulty: "Easy" as const,
    live: false,
    startsAt: "5:30 PM",
  },
]

export default function DashboardPage() {
  const [challengesData, setChallengesData] = useState(challenges)
  const [loading, setLoading ] = useState(false);
  const [error, setError] = useState(null);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/fill/your/challenges/api/here/bhayia`)
      if (response?.data) {
        setChallengesData(response.data)
      }
    } catch (err) {
      console.error("Failed to fetch challenges:", err)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [])

  return (
    <div className="grid gap-6">
      <header className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-pretty text-2xl font-semibold">Challenges</h1>
          <p className="text-sm text-muted-foreground">
            Browse live and upcoming challenges. Start any challenge to begin.
            {loading && " Loading..."}
            {error && " Error loading data, showing cached results."}
          </p>
        </div>
        <button
          onClick={fetchChallenges}
          disabled={loading}
          className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c) => (
          <ContestCard key={c.title} {...c} />
        ))}
      </section>
    </div>
  )
}
