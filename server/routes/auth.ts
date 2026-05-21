import { Router, RequestHandler } from "express";
import { loginSchema, registerSchema } from "../../shared/validation";
import { AuthResponse } from "../../shared/api";
import { logger } from "../utils/logger";

const router = Router();

// POST Login
const loginUser: RequestHandler = (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    logger.info(`Attempting login for user: ${validatedData.email}`);

    // Simple mock authentication success
    const response: AuthResponse = {
      success: true,
      message: "Login successful",
      token: "mock-jwt-token-xyz-123",
      user: {
        id: "usr-1",
        email: validatedData.email,
        name: validatedData.email.split("@")[0],
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// POST Register
const registerUser: RequestHandler = (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    logger.info(`Attempting registration for user: ${validatedData.email}`);

    const response: AuthResponse = {
      success: true,
      message: "Registration successful",
      token: "mock-jwt-token-xyz-456",
      user: {
        id: "usr-2",
        email: validatedData.email,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
