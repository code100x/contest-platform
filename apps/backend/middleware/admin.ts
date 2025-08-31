import { client } from "db/client";
import { type NextFunction, type Request, type Response  } from "express"
import jwt from "jsonwebtoken"



interface authenticatedRequest extends Request {
    userId?: string,
    userRole?: string
}

export const adminMiddleware =  async(
    req:  authenticatedRequest,
    res: Response,
    next: NextFunction 
 ) => {

    try {
            const token =  req.headers.authorization?.replace("Bearer ", "");

            if (!token) {
                return res.status(401).json({ error: "Missing token"});
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

            if (!decoded) {
                return res.status(401).json({ error: "Invalid token"});
            }

            const user = await client.user.findUnique({
                where: {
                    id: decoded.userId 
                },
                select: {
                    role: true,
                    id: true
                }
            })


            if (!user || user.role !== "Admin"){
                return res.status(401).json({ error: "Unauthorized"});
            }


            req.userId = user.id;
            req.userRole = user.role;



            
            next();








    } catch (error) {
        res.status(401).json({ error: "Invalid token"});
    }


}