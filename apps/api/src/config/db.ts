import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const pool = process.env.DATABASE_URL
    ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
      })
    : new Pool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
      });

pool.on("connect", () => {
    console.log("PostgreSQL connected successfully");
});

pool.on("error", (error) => {
    console.error("PostgreSQL error:", error);
});

export default pool;