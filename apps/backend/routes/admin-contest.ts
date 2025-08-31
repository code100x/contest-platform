import { client } from "db/client";
import { Router } from "express";
import { adminMiddleware } from "../middleware/admin";
import z from "zod"

const router = Router();

// Admin 

router.post("/contest", adminMiddleware, async(req, res ) => {
    try {
        
        const createContestSchema =  z.object({
            title: z.string().min(1, "title is missing "),
            startTime: z.string().datetime("Invalid datetime format"),
            challengeIds: z.array(z.string()).min(1, "one challenge required")
        })


        const { title, startTime, challengeIds } = createContestSchema.parse(req.body);


        const challenges = await client.challenge.findMany({
            where: {
                id: {
                    in: challengeIds
                }
            }
        })


        if (challenges.length !== challengeIds.length) {
            return res.status(404).json({ error: "Challenge not found"});
        }

        const contest = await client.contest.create({
            data: {
                title,
                startTime: new Date(startTime),
                contestToChallengeMapping: {
                    create: challengeIds.map((challengeId, index ) => ({
                        challengeId,
                        index
                    }))
                }
            },
            include: {
                contestToChallengeMapping: {
                    include: {
                        challenge: true
                    }
                }
            }
        })

        res.status(201).json({
            "msg": "Contest created successfully",
            "contest": contest
        });




    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }
})


//create challenge
router.post("/challenge", adminMiddleware, async(req, res) => {
    try {
        
        const createChallengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notionDocId: z.string().min(1, "Notion doc ID is required"),
  maxPoints: z.number().int().positive("Max points must be positive")
});

const { title, notionDocId, maxPoints } = createChallengeSchema.parse(req.body);


        const challenge = await client.challenge.create({
            data: {
                title,
                notionDocId,
                maxPoints
            }
        })

        res.status(201).json({
            "msg": "Challenge created successfully",
            "challenge": challenge
        });



    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }
});


// getting all challenges 
router.get("/challenges", adminMiddleware, async(req, res) => {
    const challengs = await client.challenge.findMany({
        orderBy: {
            title: "asc"
        }
    })

    res.status(200).json({
        "challenges": challengs
    });
})





export default router;
