import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
    process.env.JWT_SECRET || "development_secret";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required",
            });
        }

        // 2. Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }

        // 3. Get token
        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // 4. Verify JWT
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        // 5. Check decoded data
        if (
            typeof decoded === "string" ||
            !decoded.userId ||
            !decoded.role
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        // 6. Attach user to request
        req.user = {
            userId: Number(decoded.userId),
            role: String(decoded.role),
        };

        // 7. Continue
        next();
    } catch (error) {
        console.error("JWT verification error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};