import { Request, Response } from "express";

import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} from "../services/service.service";

import {
    createServiceSchema,
    updateServiceSchema,
} from "../validators/service.validator";

// Create service
export const create = async (req: Request, res: Response) => {
    try {
        const data = createServiceSchema.parse(req.body);

        const service = await createService(data);

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            service,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to create service",
        });
    }
};

// Get all services
export const getAll = async (req: Request, res: Response) => {
    try {
        const services = await getAllServices();

        res.status(200).json({
            success: true,
            services,
        });
    } catch (error: any) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch services",
        });
    }
};

// Get service by ID
export const getById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const service = await getServiceById(id);

        res.status(200).json({
            success: true,
            service,
        });
    } catch (error: any) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message || "Service not found",
        });
    }
};

// Update service
export const update = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const data = updateServiceSchema.parse(req.body);

        const service = await updateService(id, data);

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to update service",
        });
    }
};

// Delete service
export const remove = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const result = await deleteService(id);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to delete service",
        });
    }
};