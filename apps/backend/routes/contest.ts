import { Router } from "express";

const router = Router();

// https://api.devforces.com/contest?offset=10&page=20
router.get("/active", (req, res) => {
    const {offset, page} = req.query;

})

router.get("/finished", (req, res) => {
    let {offset, page} = req.query;
})

// return all the sub challenges and their start times.
router.get("/:contestId", (req, res) => {
    const contestId = req.params.contestId

})

router.get("/:contestId/:challengeId", (req, res) => {
    const contestId = req.params.contestId

})

router.get("/leaderboard/:contestId", (req, res) => {

})

router.post("/submit/:challengeId", (req, res) => {
    // have rate limitting
    // max 20 submissions per problem
    // forward the request to GPT
    // store the response in sorted set and the DB
})

export default router;