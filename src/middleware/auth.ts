import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const autHeader = req.headers.authorization;
        if (!autHeader || !autHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "You are not Allowed 😒😒😒😒"
            })
        }
        const token = autHeader.split(" ")[1] as string

        try {
            const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(500).json({ error: "Unauthorize !! ❌❌" })
            }
            next()
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired token",
            });
        }

    }
}
export default auth