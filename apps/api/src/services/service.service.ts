import pool from "../config/db";

import type {
    CreateServiceInput,
    UpdateServiceInput,
} from "../validators/service.validator";

// Create service
export const createService = async (data: CreateServiceInput) => {
    const {
        name,
        description,
        price,
        duration_minutes,
        is_active = true,
    } = data;

    const result = await pool.query(
        `INSERT INTO services
      (name, description, price, duration_minutes, is_active)
     VALUES
      ($1, $2, $3, $4, $5)
     RETURNING *`,
        [
            name,
            description || null,
            price,
            duration_minutes,
            is_active,
        ]
    );

    return result.rows[0];
};

// Get all active services
export const getAllServices = async () => {
    const result = await pool.query(
        `SELECT *
     FROM services
     WHERE is_active = true
     ORDER BY created_at DESC`
    );

    return result.rows;
};

// Get service by ID
export const getServiceById = async (id: number) => {
    const result = await pool.query(
        `SELECT *
     FROM services
     WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Service not found");
    }

    return result.rows[0];
};

// Update service
export const updateService = async (
    id: number,
    data: UpdateServiceInput
) => {
    const existingService = await getServiceById(id);

    const updatedName = data.name ?? existingService.name;
    const updatedDescription =
        data.description ?? existingService.description;
    const updatedPrice = data.price ?? existingService.price;
    const updatedDuration =
        data.duration_minutes ?? existingService.duration_minutes;
    const updatedIsActive =
        data.is_active ?? existingService.is_active;

    const result = await pool.query(
        `UPDATE services
     SET
       name = $1,
       description = $2,
       price = $3,
       duration_minutes = $4,
       is_active = $5,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
        [
            updatedName,
            updatedDescription,
            updatedPrice,
            updatedDuration,
            updatedIsActive,
            id,
        ]
    );

    return result.rows[0];
};

// Delete service
export const deleteService = async (id: number) => {
    await getServiceById(id);

    await pool.query(
        `DELETE FROM services
     WHERE id = $1`,
        [id]
    );

    return {
        message: "Service deleted successfully",
    };
};