import { Request, Response } from "express";

import {
    registerUser,
    loginUser,
} from "../services/auth.service";

import {
    registerSchema,
    loginSchema,
} from "../validators/auth.validator";

export const register = async (req: Request, res: Response) => {
    try {
        // 1. Validate request body
        const data = registerSchema.parse(req.body);

        // 2. Call service
        const user = await registerUser(data);

        // 3. Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // 1. Validate request body
        const data = loginSchema.parse(req.body);

        // 2. Call service
        const result = await loginUser(data);

        // 3. Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            ...result,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
};