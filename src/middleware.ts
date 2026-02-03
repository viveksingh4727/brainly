import { Request, Response, NextFunction } from "express"
import jwt, {JwtPayload } from "jsonwebtoken";


export interface AuthRequest extends Request {
    userId? : string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction ) => {

    try {
        const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Authorization token is missing"
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
        token as string, 
        process.env.JWT_SECRET as string
    ) as JwtPayload;
       
    req.userId = decoded.userId as string;
    next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
};