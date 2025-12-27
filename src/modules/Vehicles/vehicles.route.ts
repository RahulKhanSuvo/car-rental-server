import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/", auth("admin"), vehicleController.createVehicle)
export const vehiclesRouter = router