import { Router } from "express";

import { getStats } from "../controllers/dashboard.controller";

import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get(
    "/stats",
    authenticate,
    requireAdmin,
    getStats
);

export default router;