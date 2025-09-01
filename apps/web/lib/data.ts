import { randomUUID } from "crypto"
import type { User } from "./auth"

export type Challenge = {
  id: string
  title: string
  points: number
  live: boolean
}

export type Contest = {
  id: string
  name: string
  description: string
  live: boolean
  challenges: Challenge[]
}

export type LeaderboardEntry = {
  userId: string
  email: string
  points: number
}

type State = {
  contests: Contest[]
  leaderboard: Map<string, LeaderboardEntry>
  // userId -> started challenge ids
  starts: Map<string, Set<string>>
}

// @ts-ignore
const globalAny = global as any

const initialState = (): State => ({
  contests: [
    {
      id: randomUUID(),
      name: "September Sprint",
      description: "Ship fast: daily micro challenges for devs.",
      live: true,
      challenges: [
        { id: randomUUID(), title: "Fix a bug with a test", points: 50, live: true },
        { id: randomUUID(), title: "Build a small CLI tool", points: 80, live: true },
        { id: randomUUID(), title: "Refactor with benchmarks", points: 100, live: false },
      ],
    },
  ],
  leaderboard: new Map(),
  starts: new Map(),
})

const getState = (): State => {
  if (!globalAny.__APP_STATE__) {
    globalAny.__APP_STATE__ = initialState()
  }
  return globalAny.__APP_STATE__ as State
}

export function listContests(): Contest[] {
  return getState().contests
}

export function listLiveChallenges(): Challenge[] {
  return getState()
    .contests.flatMap((c) => c.challenges)
    .filter((ch) => ch.live)
}

export function createContest(name: string, description: string, live: boolean): Contest {
  const contest: Contest = { id: randomUUID(), name, description, live, challenges: [] }
  getState().contests.unshift(contest)
  return contest
}

export function addChallenge(contestId: string, title: string, points: number, live: boolean): Challenge | null {
  const c = getState().contests.find((x) => x.id === contestId)
  if (!c) return null
  const ch: Challenge = { id: randomUUID(), title, points, live }
  c.challenges.push(ch)
  return ch
}

export function startChallenge(user: User, challengeId: string): { ok: boolean; already?: boolean } {
  const state = getState()
  const ch = state.contests.flatMap((c) => c.challenges).find((x) => x.id === challengeId && x.live)
  if (!ch) return { ok: false }
  const set = state.starts.get(user.id) ?? new Set<string>()
  if (set.has(challengeId)) return { ok: true, already: true }
  set.add(challengeId)
  state.starts.set(user.id, set)
  // simple scoring: add points immediately for demo
  const lb = state.leaderboard.get(user.id) ?? { userId: user.id, email: user.email, points: 0 }
  lb.points += ch.points
  state.leaderboard.set(user.id, lb)
  return { ok: true }
}

export function getLeaderboard(): LeaderboardEntry[] {
  return Array.from(getState().leaderboard.values()).sort((a, b) => b.points - a.points)
}
