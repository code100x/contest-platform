import { NextResponse } from "next/server"
import { getLeaderboard } from "@/lib/data"

export async function GET() {
  return NextResponse.json({ leaderboard: getLeaderboard() })
}
