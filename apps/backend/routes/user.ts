import { Router } from "express";
import { client } from "db/client";
import z from "zod";
import bcrypt from "bcrypt"




const router = Router();

router.get("/health", (req, res) => {
    res.status(200).json({ message: req.body });
})

router.post("/signup", async(req, res) => {


    const signupSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    console.log(req.body);

    const { email, password } = signupSchema.parse(req.body);

    console.log(email, password);

        const existingUser = await client.user.findUnique({
            where: {
                email: email
            }
        })

        if(existingUser) {
            return res.status(400).json({ error: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user =  await client.user.create({
            data: {
                email: email,
                password: hashedPassword,
                role: "User"
            }
        })

        res.status(201).json(user);
})

export default router;