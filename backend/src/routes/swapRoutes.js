import express from "express";
import {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getMySwapRequests,
} from "../controllers/swapController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/swappable-slots", getSwappableSlots);
router.post("/swap-request", createSwapRequest);
router.post("/swap-response/:requestId", respondToSwapRequest);
router.get("/swap-requests", getMySwapRequests);

export default router;
