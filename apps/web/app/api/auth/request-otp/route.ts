import { NextResponse } from "next/server"
import { issueOtp } from "@/lib/auth"

export async function POST(request: Request) {
  const { email } = await request.json()
  if (!email || typeof email !== "string") {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 })
  }
  const { code, ttlSeconds } = issueOtp(email)
  // In a real app, send the code via email. For this demo, return it so user can proceed.
  return NextResponse.json({ ok: true, devCode: code, ttlSeconds })
}
