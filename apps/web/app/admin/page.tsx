"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/hooks/use-toast"

type SubChallenge = { title: string; points: number; live: boolean }

export default function AdminPage() {
  // const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [live, setLive] = useState(false)
  const [subs, setSubs] = useState<SubChallenge[]>([{ title: "Warm-up task", points: 100, live: true }])
  const [scheduled, setScheduled] = useState(false)
  const [startAt, setStartAt] = useState<string>("")
  const [endAt, setEndAt] = useState<string>("")

  const addSub = () => setSubs((s) => [...s, { title: "", points: 100, live: false }])
  const removeSub = (idx: number) => setSubs((s) => s.filter((_, i) => i !== idx))
  const updateSub = (idx: number, patch: Partial<SubChallenge>) =>
    setSubs((s) => s.map((item, i) => (i === idx ? { ...item, ...patch } : item)))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // toast({
    //   title: "Contest created (mock)",
    //   description: `“${name || "Untitled"}” with ${subs.length} sub-challenge(s). ${
    //     scheduled && startAt ? `Starts at ${new Date(startAt).toLocaleString()}.` : ""
    //   }`,
    // })
    setName("")
    setDescription("")
    setLive(false)
    setSubs([{ title: "Warm-up task", points: 100, live: true }])
    setScheduled(false)
    setStartAt("")
    setEndAt("")
  }

  return (
    <div className="grid gap-6">
      <header className="space-y-1">
        <h1 className="text-pretty text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Create a contest and add sub-challenges. This is a frontend-only mock.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Contest</CardTitle>
          <CardDescription>Define the contest metadata and add sub-challenges.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="100x Sprint"
                required
                className="transition-shadow duration-150 focus-visible:shadow-sm"
              />
              <p className="text-xs text-muted-foreground">Keep it short and recognizable.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A fast-paced developer contest focusing on modern web fundamentals."
                rows={4}
                required
                className="transition-shadow duration-150 focus-visible:shadow-sm"
              />
              <p className="text-xs text-muted-foreground">What participants should expect.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Switch id="live" checked={live} onCheckedChange={setLive} />
                <Label htmlFor="live" className="text-sm text-muted-foreground">
                  Live
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="scheduled" checked={scheduled} onCheckedChange={setScheduled} />
                <Label htmlFor="scheduled" className="text-sm text-muted-foreground">
                  Schedule for later
                </Label>
              </div>
            </div>

            {scheduled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="startAt">Start at</Label>
                  <Input
                    id="startAt"
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="transition-shadow duration-150 focus-visible:shadow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endAt">End at (optional)</Label>
                  <Input
                    id="endAt"
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className="transition-shadow duration-150 focus-visible:shadow-sm"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Sub-challenges</h3>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addSub}
                  className="transition-transform duration-150 hover:translate-y-[-1px]"
                >
                  Add sub-challenge
                </Button>
              </div>

              <div className="grid gap-4">
                {subs.map((sc, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`title-${idx}`}>Title</Label>
                        <Input
                          id={`title-${idx}`}
                          value={sc.title}
                          onChange={(e) => updateSub(idx, { title: e.target.value })}
                          placeholder="Implement LRU Cache"
                          required
                          className="transition-shadow duration-150 focus-visible:shadow-sm"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`points-${idx}`}>Points</Label>
                        <Input
                          id={`points-${idx}`}
                          type="number"
                          value={sc.points}
                          onChange={(e) => updateSub(idx, { points: Number(e.target.value) || 0 })}
                          min={0}
                          required
                          className="transition-shadow duration-150 focus-visible:shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          id={`live-${idx}`}
                          checked={sc.live}
                          onCheckedChange={(checked) => updateSub(idx, { live: checked })}
                        />
                        <Label htmlFor={`live-${idx}`} className="text-sm text-muted-foreground">
                          Live
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeSub(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="transition-transform duration-150 hover:translate-y-[-1px]">
                Create contest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
