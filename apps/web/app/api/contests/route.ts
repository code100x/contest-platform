import { NextResponse } from "next/server"
import { createContest, listContests } from "@/lib/data"
import { getSessionUser } from "@/lib/auth"

export async function GET() {
  return NextResponse.json({ contests: listContests() })
}

export async function POST(request: Request) {
  const user = getSessionUser()
  if (!user || !user.isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }
  const { name, description, live } = await request.json()
  if (!name || !description) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 })
  }
  const contest = createContest(name, description, Boolean(live))
  return NextResponse.json({ ok: true, contest })
}
