import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"

export async function GET() {
  const user = getSessionUser()
  return NextResponse.json({ user })
}
