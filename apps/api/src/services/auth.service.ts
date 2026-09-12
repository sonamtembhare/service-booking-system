import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import pool from "../config/db";
import type {
    RegisterInput,
    LoginInput,
} from "../validators/auth.validator";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

export const registerUser = async (data: RegisterInput) => {
    const { name, password } = data;
    const email = data.email.toLowerCase();

    // 1. Check if email already exists
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already registered");
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create customer
    const result = await pool.query(
        `INSERT INTO users
      (name, email, password_hash, role)
     VALUES
      ($1, $2, $3, 'customer')
     RETURNING id, name, email, role, created_at`,
        [name, email, passwordHash]
    );

    return result.rows[0];
};

export const loginUser = async (data: LoginInput) => {
    const email = data.email.toLowerCase();

    // 1. Find user
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // 3. Create JWT token
    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    // 4. Return user + token
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};