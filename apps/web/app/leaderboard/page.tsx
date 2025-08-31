"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import useAxios from "@/hook/useAxios"
import { BACKEND_URL } from "@/config"

const rows = [
  { rank: 1, name: "Aditi Rao", score: 980 },
  { rank: 2, name: "Arjun Sharma", score: 930 },
  { rank: 3, name: "Maya Patel", score: 905 },
  { rank: 4, name: "Nikhil Nair", score: 880 },
  { rank: 5, name: "Meera Iyer", score: 860 },
  { rank: 6, name: "Rohit Gupta", score: 845 },
  { rank: 7, name: "Ishita Verma", score: 832 },
  { rank: 8, name: "Tushar Desai", score: 810 },
];

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState(rows)
  const { data, error, loading, get } = useAxios()

  const fetchLeaderboard = async () => {
    try {
      const response = await get(`${BACKEND_URL}/fill/your/leaderboard/api/here/bhayia`)
      if (response?.data) {
        setLeaderboardData(response.data)
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  return (
    <div className="grid gap-6">
      <header className="space-y-1">
        <h1 className="text-pretty text-2xl font-semibold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">
          Top participants by cumulative score across challenges.
          {loading && " Loading..."}
          {error && " Error loading data, showing cached results."}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All-time Ranking</CardTitle>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto rounded-md border">
            <table className="w-full table-auto text-left">
              <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur supports-[backdrop-filter]:bg-muted/30">
                <tr className="text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Rank</th>
                  <th className="px-3 py-2 font-medium">Participant</th>
                  <th className="px-3 py-2 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const top = r.rank <= 3
                  return (
                    <tr
                      key={r.rank}
                      className="border-t border-border transition-all duration-150 hover:translate-x-0.5 hover:bg-muted/50 odd:bg-muted/30"
                    >
                      <td className="px-3 py-2 text-sm">
                        <span
                          className={
                            top
                              ? "inline-flex min-w-6 items-center justify-center rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
                              : "inline-flex min-w-6 items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                          }
                          aria-label={`Rank ${r.rank}`}
                        >
                          {r.rank}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <div className="flex items-center gap-3">
                          <Avatar className={"h-6 w-6 " + (top ? "ring-2 ring-primary" : "")}>
                            <AvatarFallback className="text-[10px]">
                              {r.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-foreground">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-mono tabular-nums">{r.score}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
