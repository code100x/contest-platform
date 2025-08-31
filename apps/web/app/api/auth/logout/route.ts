import { NextResponse } from "next/server"
import { SESSION_COOKIE, destroySession } from "@/lib/auth"

export async function POST() {
  destroySession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 })
  return res
}
