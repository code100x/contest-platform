import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { startChallenge } from "@/lib/data"

export async function POST(request: Request) {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  const { challengeId } = await request.json()
  if (!challengeId) return NextResponse.json({ ok: false, error: "challengeId required" }, { status: 400 })
  const result = startChallenge(user, challengeId)
  if (!result.ok) return NextResponse.json({ ok: false, error: "Invalid challenge" }, { status: 400 })
  return NextResponse.json({ ok: true, already: result.already ?? false })
}
