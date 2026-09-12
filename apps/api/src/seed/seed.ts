import dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcryptjs";
import pool from "../config/db";

const seed = async () => {
    try {
        console.log("Starting database seed...");

        // =========================
        // ENSURE TABLES EXIST
        // =========================

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT users_role_check CHECK (role IN ('customer', 'admin'))
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                duration_minutes INTEGER NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT services_price_check CHECK (price > 0),
                CONSTRAINT services_duration_check CHECK (duration_minutes > 0)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                service_id INTEGER NOT NULL,
                booking_date DATE NOT NULL,
                booking_time TIME NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_booking_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
                CONSTRAINT booking_status_check CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
                CONSTRAINT unique_booking_slot UNIQUE (service_id, booking_date, booking_time)
            )
        `);

        console.log("Database tables verified/created");

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

        const existingCheck = await pool.query(
            "SELECT COUNT(*) FROM services"
        );
        const serviceCount = parseInt(
            existingCheck.rows[0].count,
            10
        );

        if (serviceCount === 0) {
            const services = [
                {
                    name: "Haircut",
                    description:
                        "Professional haircut and styling",
                    price: 500,
                    duration: 30,
                },
                {
                    name: "Hair Spa",
                    description:
                        "Deep conditioning and relaxing hair spa",
                    price: 1000,
                    duration: 60,
                },
                {
                    name: "Hair Coloring",
                    description:
                        "Professional hair coloring service",
                    price: 1500,
                    duration: 90,
                },
                {
                    name: "Facial",
                    description:
                        "Deep cleansing and refreshing facial",
                    price: 800,
                    duration: 45,
                },
                {
                    name: "Gold Facial",
                    description:
                        "Premium gold facial treatment",
                    price: 1200,
                    duration: 60,
                },
                {
                    name: "Manicure",
                    description:
                        "Complete nail cleaning and manicure",
                    price: 400,
                    duration: 30,
                },
                {
                    name: "Pedicure",
                    description:
                        "Relaxing foot care and pedicure",
                    price: 500,
                    duration: 40,
                },
                {
                    name: "Head Massage",
                    description:
                        "Relaxing head and scalp massage",
                    price: 350,
                    duration: 30,
                },
                {
                    name: "Body Massage",
                    description:
                        "Full body relaxing massage",
                    price: 1500,
                    duration: 60,
                },
                {
                    name: "Aromatherapy",
                    description:
                        "Relaxing aromatherapy spa treatment",
                    price: 1800,
                    duration: 75,
                },
                {
                    name: "Bridal Makeup",
                    description:
                        "Professional bridal makeup service",
                    price: 5000,
                    duration: 180,
                },
                {
                    name: "Party Makeup",
                    description:
                        "Professional makeup for parties and events",
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
        } else {
            console.log(
                `${serviceCount} services already exist, skipping insert`
            );
        }

        console.log("Database seed completed successfully!");
    } catch (error) {
        console.error("Database seed failed:", error);
    } finally {
        await pool.end();
    }
};

seed();