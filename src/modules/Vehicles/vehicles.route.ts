import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/", auth("admin"), vehicleController.createVehicle)
router.get("/", vehicleController.getAllVehicles)
export const vehiclesRouter = router