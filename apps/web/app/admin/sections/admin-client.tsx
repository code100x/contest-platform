"use client"

import type React from "react"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminClient() {
  const { data, mutate } = useSWR("/api/contests", fetcher)
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [live, setLive] = useState(true)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/contests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc, live }),
    })
    const json = await res.json()
    if (json.ok) {
      setName("")
      setDesc("")
      setLive(true)
      await mutate()
      toast({ title: "Contest created" })
    } else {
      toast({ title: "Error", description: json.error || "Failed", variant: "destructive" })
    }
  }

  const addChallenge = async (contestId: string, title: string, points: number, live: boolean) => {
    const res = await fetch(`/api/contests/${contestId}/challenges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, points, live }),
    })
    const json = await res.json()
    if (json.ok) {
      await mutate()
      toast({ title: "Challenge added" })
    } else {
      toast({ title: "Error", description: json.error || "Failed", variant: "destructive" })
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-pretty text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-slate-600">Create contests and add sub-challenges.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create contest</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2 sm:col-span-1">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} required />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch id="live" checked={live} onCheckedChange={setLive} />
              <Label htmlFor="live">Live</Label>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {data?.contests?.map((c: any) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-lg">{c.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="text-sm text-slate-600">{c.description}</div>
              <div className="text-sm">
                <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">{c.live ? "Live" : "Draft"}</span>
              </div>

              <ChallengeAdder contestId={c.id} onAdded={() => mutate()} />
              <div className="grid gap-2">
                <div className="text-sm font-medium">Sub-challenges</div>
                <ul className="list-inside list-disc text-sm text-slate-600">
                  {c.challenges.map((ch: any) => (
                    <li key={ch.id}>
                      {ch.title} — {ch.points} pts {ch.live ? "(live)" : "(draft)"}
                    </li>
                  ))}
                  {c.challenges.length === 0 && <li className="list-none text-slate-500">No challenges yet.</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ChallengeAdder({ contestId, onAdded }: { contestId: string; onAdded: () => void }) {
  const [title, setTitle] = useState("")
  const [points, setPoints] = useState<number | "">(50)
  const [live, setLive] = useState(true)

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (points === "") return
    const res = await fetch(`/api/contests/${contestId}/challenges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, points: Number(points), live }),
    })
    const json = await res.json()
    if (json.ok) {
      setTitle("")
      setPoints(50)
      setLive(true)
      onAdded()
    }
  }

  return (
    <form onSubmit={add} className="grid gap-4 sm:grid-cols-3">
      <div className="grid gap-2">
        <Label htmlFor={`title-${contestId}`}>Title</Label>
        <Input id={`title-${contestId}`} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`points-${contestId}`}>Points</Label>
        <Input
          id={`points-${contestId}`}
          type="number"
          min={0}
          value={points}
          onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-2">
          <Switch id={`live-${contestId}`} checked={live} onCheckedChange={setLive} />
          <Label htmlFor={`live-${contestId}`}>Live</Label>
        </div>
        <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
          Add
        </Button>
      </div>
    </form>
  )
}
