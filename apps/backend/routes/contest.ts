import { client } from "db/client";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import z from "zod";
import { adminMiddleware } from "../middleware/admin";
import { userMiddleware, type authenticatedRequest } from "../middleware/user";

const router = Router();


// GET  /contest/active
// https://api.devforces.com/contest?offset=10&page=20
router.get("/active", async(req, res) => {
    
    try {

            const offset = parseInt(req.query.offset as string) || 0;
            const page = parseInt(req.query.page as string) || 20;

        const contests = await client.contest.findMany({
            include: {
                contestToChallengeMapping: {
                    include: {
                        challenge: {
                            select: {
                                id: true,
                                title: true,
                                maxPoints: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        leaderboard: true
                    }
                }
            },
            skip: page * offset,
            take: offset,
            orderBy: {
                startTime: "desc"
            }




        });


        res.status(200).json(contests);

    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }


})

// GET /contest/finished
router.get("/finished", async(req, res) => {
    
    try {
        
            const offset = parseInt(req.query.offset as string) || 0;
             const page = parseInt(req.query.page as string) || 20;

            const contests = await client.contest.findMany({
                include: {
                    contestToChallengeMapping: {
                        include: {
                            challenge: {
                                select: {
                                    id: true,
                                    title: true,
                                    maxPoints: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            leaderboard: true
                        }
                    }
                },
                skip: offset * page,
                take: offset,
                orderBy: {
                    startTime: "desc"
                }
            })

            res.json({ 
      success: true,
      contests: contests,
      count: contests.length
    });

        
    } catch (error) {
        res.sendStatus(500).json({ error: "Internal server error"});
    }


})

// GET /contest/:contestId
// return all the sub challenges and their start times.
router.get("/:contestId", async(req, res) => {
    
    try {
        const contestId = req.params.contestId

        const contests =  await client.contest.findUnique({
            where: {
                id: contestId
            },
            include: {
                contestToChallengeMapping: {
                    include: {
                        challenge: {
                            select: {
                                id: true,
                                title: true,
                                maxPoints: true,
                                notionDocId: true
                            }
                        }
                    },
                    orderBy: {
                        index: "asc"
                    }
                }
            }
        })

        if (!contests) {
            return res.status(404).json({ error: "Contest not found"});
        }


        res.status(200).json(contests);



        



    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }


})

router.get("/:contestId/:challengeId", async(req, res) => {
    
    try {
        const contestId = req.params.contestId;
        const challengeId = req.params.challengeId;

        const contest = await client.contestToChallengeMapping.findFirst({
            where: {
                contestId,
                challengeId
            },
            include: {
                challenge: true,
                contest: {
                    select: {
                        id: true,
                        title: true,
                        startTime: true
                    }
                }
            }
        })

        if (!contest) {
            return res.status(404).json({ error: "Challenge not found"});
        }


        res.status(200).json(contest);



        
    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }

})


// /contest/leaderboard/:contestId
router.get("/leaderboard/:contestId", async(req, res) => {

    try {
        const contestId = req.params.contestId

        const learderboard = await client.leaderboard.findMany({
            where: {
                contestId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            },
            orderBy: {
                rank: "asc"
            }
        })


        if (!learderboard) {
            return res.status(404).json({ error: "Leaderboard not found"});
        }

        res.status(200).json(learderboard);


    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }


})



// rate limiting 
const ratelimit =  rateLimit({
    max:20,
    message: "too many request to this problem",
})


// POST OST /contest/submit/:challengeId 
router.post("/submit/:challengeId", ratelimit, userMiddleware,  async(req: authenticatedRequest, res) => {
    // have rate limitting done 

    // max 20 submissions per problem
    try {

        const challengeId = req.params.challengeId;
        const userId = req.userId!;

        const submission = req.body.submission

        const contestToChallengeMapping = await client.contestToChallengeMapping.findFirst({
            where: {
                challengeId
            },
            include: {
                challenge: true,
                contest: true
            }
        })


        if (!contestToChallengeMapping) {
            return res.status(404).json({ error: "Challenge not found"});
        }


        //checking contest started or not 
        if (contestToChallengeMapping.contest.startTime > new Date()) {
            return res.status(400).json({ error: "Contest not started yet"});
        }

        // maximut 20 submission 
        const submissionCount = await client.submission.count({
            where: {
                userId,
                contestToChallengeMappingId: contestToChallengeMapping.id
            }
        });



        if (submissionCount >= 20) {
            return res.status(400).json({ error: "You have already submitted 20 times"});
        }

        const finalSubmission = await client.submission.create({
            data: {
                userId,
                contestToChallengeMappingId: contestToChallengeMapping.id,
                submission,
                points: 0 // will update on stage 2
            }
        })


        res.status(200).json({
            "msg": "Submission created successfully",
            "submission": {
                id: finalSubmission.id,
                createdAt: finalSubmission.createdAt,
                remaingSubmissions: 20 - submissionCount

            }
        });



    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }

    // forward the request to GPT
    // store the response in sorted set and the DB
})






export default router;