import { Router } from "express";
import { vehicleController } from "./vehicles.controller";

const router = Router();
router.post("/", vehicleController.createVehicle)
export const vehiclesRouter = router