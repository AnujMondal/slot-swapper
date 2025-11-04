import express from "express";
import {
  getMyEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.route("/").get(getMyEvents).post(createEvent);

router.route("/:id").get(getEvent).put(updateEvent).delete(deleteEvent);

export default router;
