import { NextResponse } from "next/server"
import { listLiveChallenges } from "@/lib/data"

export async function GET() {
  return NextResponse.json({ challenges: listLiveChallenges() })
}
