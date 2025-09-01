import { NextResponse } from "next/server"
import { addChallenge } from "@/lib/data"
import { getSessionUser } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser()
  if (!user || !user.isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  const { title, points, live } = await request.json()
  if (!title || typeof points !== "number") {
    return NextResponse.json({ ok: false, error: "Missing/invalid fields" }, { status: 400 })
  }
  const ch = addChallenge(params.id, title, points, Boolean(live))
  if (!ch) return NextResponse.json({ ok: false, error: "Contest not found" }, { status: 404 })
  return NextResponse.json({ ok: true, challenge: ch })
}
