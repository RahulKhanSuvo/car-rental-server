import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()
router.post("/signup", authController.signUpUser)
router.post("/signin", authController.signUpUser)

export const authRouters = router