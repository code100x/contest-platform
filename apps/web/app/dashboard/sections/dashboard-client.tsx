"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DashboardClient() {
  const { data, isLoading, mutate } = useSWR("/api/challenges/live", fetcher)

  const start = async (id: string) => {
    const res = await fetch("/api/challenges/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: id }),
    })
    const json = await res.json()
    if (json.ok) {
      await mutate()
      fetch("/api/leaderboard")
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-pretty text-2xl font-semibold">Live challenges</h1>
        <p className="text-sm text-slate-600">Start any live challenge to earn points.</p>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data?.challenges?.map((c: any) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
                <CardDescription>Worth {c.points} pts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => start(c.id)} className="bg-sky-600 hover:bg-sky-700">
                  Start challenge
                </Button>
              </CardContent>
            </Card>
          ))}
          {(!data || data.challenges.length === 0) && (
            <p className="text-sm text-slate-500">No live challenges right now.</p>
          )}
        </div>
      )}
    </div>
  )
}
