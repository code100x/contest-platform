
import { Router } from "express";
import { userMiddleware } from "../middleware/user";
import { adminMiddleware } from "../middleware/admin";

const router = Router();

router.post("/contest", adminMiddleware, (req, res) => {
    const {offset, page} = req.query;

})

router.post("/challenge", adminMiddleware, (req, res) => {
    const {offset, page} = req.query;

})

router.post("/link/:challengeId/:contestId", adminMiddleware, (req, res) => {
    const {offset, page} = req.query;

})

router.delete("/link/:challengeId/:contestId", adminMiddleware, (req, res) => {
    const {offset, page} = req.query;

})

export default router;