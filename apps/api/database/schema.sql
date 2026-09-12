-- =========================================
-- SPA & SALON SERVICE BOOKING SYSTEM
-- DATABASE SCHEMA
-- =========================================


-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
    CHECK (role IN ('customer', 'admin'))
);


-- =========================================
-- SERVICES TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT services_price_check
    CHECK (price > 0),

    CONSTRAINT services_duration_check
    CHECK (duration_minutes > 0)
);


-- =========================================
-- BOOKINGS TABLE
-- =========================================

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


    -- USER RELATION
    CONSTRAINT fk_booking_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,


    -- SERVICE RELATION
    CONSTRAINT fk_booking_service
    FOREIGN KEY (service_id)
    REFERENCES services(id)
    ON DELETE CASCADE,


    -- BOOKING STATUS
    CONSTRAINT booking_status_check
    CHECK (
        status IN (
            'pending',
            'confirmed',
            'cancelled',
            'completed'
        )
    ),


    -- DUPLICATE SLOT PREVENTION
    CONSTRAINT unique_booking_slot
    UNIQUE (
        service_id,
        booking_date,
        booking_time
    )
);