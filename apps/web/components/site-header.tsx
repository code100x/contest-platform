"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthProvider"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const { loading, logout, accessToken, user } = useAuth();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    if (logoutLoading) return;
    
    setLogoutLoading(true);
    try {
      await logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link 
          href={accessToken ? "/dashboard" : "/signin"} 
          className="group flex items-center gap-2" 
          aria-label="100xContest home"
        >
          <svg
            className="h-7 w-7 text-primary transition-transform duration-150 group-hover:rotate-[3deg] group-active:scale-95"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="text-balance text-lg font-semibold tracking-tight">
            <span className="text-foreground">100x</span>
            <span className="ms-1 text-muted-foreground">Contest</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div className="h-9 w-20 animate-pulse rounded bg-muted"></div>
            </div>
          ) : accessToken ? (
            <>
              <Link
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none focus-visible:underline focus-visible:underline-offset-4"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none focus-visible:underline focus-visible:underline-offset-4"
                href="/leaderboard"
              >
                Leaderboard
              </Link>
                {user?.role === "Admin" && (
                  <Link
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none focus-visible:underline focus-visible:underline-offset-4"
                    href="/admin"
                  >
                    Admin
                  </Link>
                )}
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  disabled={logoutLoading}
                  className="transition-transform duration-150 hover:translate-y-[-1px]"
                >
                  {logoutLoading ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none focus-visible:underline focus-visible:underline-offset-4"
                href="/leaderboard"
              >
                Leaderboard
              </Link>
              <Button asChild className="transition-transform duration-150 hover:translate-y-[-1px]">
                <Link href="/signin">Sign in</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
