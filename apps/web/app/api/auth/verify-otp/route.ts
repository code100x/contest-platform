import { NextResponse } from "next/server"
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, verifyOtpAndCreateSession } from "@/lib/auth"

export async function POST(request: Request) {
  const { email, code } = await request.json()
  if (!email || !code) {
    return NextResponse.json({ ok: false, error: "Email and code required" }, { status: 400 })
  }
  const result = verifyOtpAndCreateSession(email, code)
  if (!result) {
    return NextResponse.json({ ok: false, error: "Invalid or expired code" }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true, user: result.user })
  res.cookies.set(SESSION_COOKIE, result.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return res
}
