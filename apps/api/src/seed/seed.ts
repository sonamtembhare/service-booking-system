import dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcryptjs";
import pool from "../config/db";

const seed = async () => {
    try {
        console.log("Starting database seed...");

        // =========================
        // ADMIN USER
        // =========================

        const adminPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        const adminResult = await pool.query(
            `INSERT INTO users
        (name, email, password_hash, role)
       VALUES
        ($1, $2, $3, $4)
       ON CONFLICT (email)
       DO UPDATE SET
         role = 'admin'
       RETURNING id, name, email, role`,
            [
                "Salon Admin",
                "admin@salon.com",
                adminPassword,
                "admin",
            ]
        );

        console.log("Admin created:", adminResult.rows[0]);

        // =========================
        // SPA & SALON SERVICES
        // =========================

        const services = [
            {
                name: "Haircut",
                description: "Professional haircut and styling",
                price: 500,
                duration: 30,
            },
            {
                name: "Hair Spa",
                description: "Deep conditioning and relaxing hair spa",
                price: 1000,
                duration: 60,
            },
            {
                name: "Hair Coloring",
                description: "Professional hair coloring service",
                price: 1500,
                duration: 90,
            },
            {
                name: "Facial",
                description: "Deep cleansing and refreshing facial",
                price: 800,
                duration: 45,
            },
            {
                name: "Gold Facial",
                description: "Premium gold facial treatment",
                price: 1200,
                duration: 60,
            },
            {
                name: "Manicure",
                description: "Complete nail cleaning and manicure",
                price: 400,
                duration: 30,
            },
            {
                name: "Pedicure",
                description: "Relaxing foot care and pedicure",
                price: 500,
                duration: 40,
            },
            {
                name: "Head Massage",
                description: "Relaxing head and scalp massage",
                price: 350,
                duration: 30,
            },
            {
                name: "Body Massage",
                description: "Full body relaxing massage",
                price: 1500,
                duration: 60,
            },
            {
                name: "Aromatherapy",
                description: "Relaxing aromatherapy spa treatment",
                price: 1800,
                duration: 75,
            },
            {
                name: "Bridal Makeup",
                description: "Professional bridal makeup service",
                price: 5000,
                duration: 180,
            },
            {
                name: "Party Makeup",
                description: "Professional makeup for parties and events",
                price: 2500,
                duration: 90,
            },
        ];

        for (const service of services) {
            await pool.query(
                `INSERT INTO services
          (
            name,
            description,
            price,
            duration_minutes,
            is_active
          )
         VALUES
          ($1, $2, $3, $4, true)`,
                [
                    service.name,
                    service.description,
                    service.price,
                    service.duration,
                ]
            );
        }

        console.log(
            `${services.length} Spa & Salon services created`
        );

        console.log("Database seed completed successfully!");
    } catch (error) {
        console.error("Database seed failed:", error);
    } finally {
        await pool.end();
    }
};

seed();