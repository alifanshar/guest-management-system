import express from "express";
import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../controllers/guest.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getGuests);
router.post("/", createGuest);
router.put("/:id", updateGuest);
router.delete("/:id", deleteGuest);

export default router;
