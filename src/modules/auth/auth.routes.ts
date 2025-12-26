import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()
router.post("/signup", authController.signUpUse)
export const authRouters = router