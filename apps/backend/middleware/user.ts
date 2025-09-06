import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function userMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;

    try {
        const decoded = jwt.verify(token, process.env.USER_JWT_PASSWORD!) as JwtPayload;
        if (decoded.userId) {
            req.userId = decoded.userId;
            next()
        } else {
            res.status(403).json({
                message: "Incorrect token"
            })
        }
    } catch(e) {
        res.status(403).json({
            message: "Incorrect token"
        })
    }
}