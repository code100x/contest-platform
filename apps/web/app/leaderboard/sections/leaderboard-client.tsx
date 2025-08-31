"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function LeaderboardClient() {
  const { data, isLoading } = useSWR("/api/leaderboard", fetcher)

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-pretty text-2xl font-semibold">Leaderboard</h1>
        <p className="text-sm text-slate-600">Top participants across all live challenges.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall ranking</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.leaderboard?.map((row: any, idx: number) => (
                  <TableRow key={row.userId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell className="text-right">{row.points}</TableCell>
                  </TableRow>
                ))}
                {(!data || data.leaderboard.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-sm text-slate-500">
                      No entries yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
