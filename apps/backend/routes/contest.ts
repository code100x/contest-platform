import { Router } from "express";
import { client } from "db/client";
import { rateLimit } from "express-rate-limit";

const router = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many submissions, please try again after 15 minutes",
});

// https://api.devforces.com/contest?offset=10&page=20
router.get("/active", async (req, res) => {
  try {
    const { offset = 0, page = 10 } = req.query;
    const currentTime = new Date();

    const contests = await client.contest.findMany({
      where: {
        startTime: {
          lte: currentTime,
        },
      },
      skip: parseInt(offset as string),
      take: parseInt(page as string),
      include: {
        contestToChallengeMapping: {
          include: {
            challenge: true,
          },
        },
      },
    });
    res.status(200).json(contests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch active contests" });
  }
});

router.get("/finished", async (req, res) => {
  try {
    const { offset = 0, page = 10 } = req.query;
    const currentTime = new Date();

    const contests = await client.contest.findMany({
      where: {
        startTime: {
          lt: currentTime,
        },
      },
      skip: parseInt(offset as string),
      take: parseInt(page as string),
      include: {
        contestToChallengeMapping: {
          include: {
            challenge: true,
          },
        },
      },
    });

    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch finished contests" });
  }
});

// return all the sub challenges and their start times.
router.get("/:contestId", async (req, res) => {
  try {
    const contestId = req.params.contestId;

    const contest = await client.contest.findUnique({
      where: { id: contestId },
      include: {
        contestToChallengeMapping: {
          include: {
            challenge: true,
          },
          orderBy: {
            index: "asc",
          },
        },
      },
    });

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contest" });
  }
});

router.get("/:contestId/:challengeId", async (req, res) => {
  try {
    const { contestId, challengeId } = req.params;

    const challengeMapping = await client.contestToChallengeMapping.findFirst({
      where: {
        contestId,
        challengeId,
      },
      include: {
        challenge: true,
        contest: true,
      },
    });

    if (!challengeMapping) {
      return res
        .status(404)
        .json({ error: "Challenge not found in this contest" });
    }

    res.json(challengeMapping);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
});

router.get("/leaderboard/:contestId", async (req, res) => {
  try {
    const contestId = req.params.contestId;

    const leaderboard = await client.leaderboard.findMany({
      where: { contestId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        rank: "asc",
      },
    });

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

router.post("/submit/:challengeId", limiter, async (req, res) => {
  // have rate limitting
  // max 20 submissions per problem
  // forward the request to GPT
  // store the response in sorted set and the DB
});

export default router;
