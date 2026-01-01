import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router()
router.get("/", auth("admin"), userController.getAllUsers)
router.put("/:id", auth("admin", "customer"), userController.updateUserById)
router.delete("/:id", auth("admin"), userController.deleteUserById)

export const userRouter = router