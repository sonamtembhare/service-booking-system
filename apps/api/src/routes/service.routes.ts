import { Router } from "express";

import {
    create,
    getAll,
    getById,
    update,
    remove,
} from "../controllers/service.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

// Get all services (public)
router.get("/", getAll);

// Get service by ID (public)
router.get("/:id", getById);

// Admin routes
router.post("/", authenticate, requireAdmin, create);
router.put("/:id", authenticate, requireAdmin, update);
router.delete("/:id", authenticate, requireAdmin, remove);

export default router;