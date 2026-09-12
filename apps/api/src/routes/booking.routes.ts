import { Router } from "express";

import {
    create,
    getMyBookings,
    cancel,
    getAll,
    updateStatus,
} from "../controllers/booking.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

// Customer routes
router.post("/", authenticate, create);

router.get(
    "/my",
    authenticate,
    getMyBookings
);

router.patch(
    "/:id/cancel",
    authenticate,
    cancel
);

// Admin routes
router.get(
    "/admin/all",
    authenticate,
    requireAdmin,
    getAll
);

router.patch(
    "/admin/:id/status",
    authenticate,
    requireAdmin,
    updateStatus
);

export default router;