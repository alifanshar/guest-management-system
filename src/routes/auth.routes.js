import express from "express";
import {
  register,
  login,
  refreshToken,
  me,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.get("/me", authenticate, me);

export default router;
