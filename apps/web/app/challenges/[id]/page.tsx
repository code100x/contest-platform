"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function ChallengePage() {
  const params = useParams()
  const id = params?.id as string
  const [lang, setLang] = useState("typescript")
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0")
  const ss = String(elapsed % 60).padStart(2, "0")

  const tasks = useMemo(
    () => [
      "Define rate limiter interface",
      "Implement sliding window algorithm",
      "Handle per-user keys",
      "Respect burst within limits",
      "Return retryAfter correctly",
    ],
    [],
  )
  const [checked, setChecked] = useState<boolean[]>(Array(tasks.length).fill(false))
  const score = checked.filter(Boolean).length * 2

  const toggle = (idx: number, value: boolean) => setChecked((arr) => arr.map((v, i) => (i === idx ? value : v)))

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-pretty text-xl font-semibold tracking-tight md:text-2xl">Challenge #{id}</h1>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Medium</span>
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-foreground">
            {mm}:{ss}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: details + checklist */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Build a Rate Limiter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Implement a rate limiter for an API with a sliding window strategy. Provide an interface and a simple
              in-memory implementation.
            </p>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold">Requirements</h2>
              <ul className="ms-5 list-disc text-sm text-muted-foreground">
                <li>Expose check and record methods</li>
                <li>Support per-user key</li>
                <li>Handle bursts within limits</li>
                <li>Include minimal testable surface</li>
              </ul>
            </div>

            <div className="grid gap-3">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold">Check</h2>
                <span className="text-xs text-muted-foreground">
                  Score: <span className="font-medium text-foreground">{score}</span>/10
                </span>
              </div>
              <div className="grid gap-2">
                {tasks.map((t, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={checked[i]}
                      onCheckedChange={(v) => toggle(i, Boolean(v))}
                      className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <h2 className="text-sm font-semibold">Input / Output</h2>
              <p className="text-sm text-muted-foreground">
                Input: userId, now(). Output: boolean allowed, retryAfter in ms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right: editor */}
        <Card className="h-full">
          <CardHeader className="flex items-center justify-between gap-3 pb-2">
            <CardTitle className="text-base">Your solution</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="lang" className="sr-only">
                Language
              </Label>
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger id="lang" className="h-8 w-[160px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="code" className="text-xs text-muted-foreground">
              Paste your code
            </Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={18}
              className="font-mono text-sm tabular-nums transition-shadow duration-150 focus-visible:shadow-sm"
              placeholder="// Paste your solution here"
            />
            <div className="flex items-center gap-3">
              <Button
                disabled={submitting || code.trim().length === 0}
                onClick={() => {
                  setSubmitting(true)
                  setTimeout(() => setSubmitting(false), 900)
                }}
                className="transition-transform duration-150 hover:translate-y-[-1px]"
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
              <Button variant="secondary" onClick={() => setCode("")} className="transition-colors duration-150">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
