import { Router } from "express";

import {
    create,
    getAll,
    getById,
    update,
    remove,
} from "../controllers/service.controller";

const router = Router();

// Create service
router.post("/", create);

// Get all services
router.get("/", getAll);

// Get service by ID
router.get("/:id", getById);

// Update service
router.put("/:id", update);

// Delete service
router.delete("/:id", remove);

export default router;