"use client"

import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const onClick = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/signin"
  }
  return (
    <Button onClick={onClick} variant="outline">
      Sign out
    </Button>
  )
}
