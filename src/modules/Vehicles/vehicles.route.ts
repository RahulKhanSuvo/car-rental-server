import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/", auth("admin"), vehicleController.createVehicle)
router.get("/", vehicleController.getAllVehicles)
router.get("/:id", vehicleController.getVehiclesById)
router.put("/:id", auth("admin"), vehicleController.updateVehiclesBuId)
router.delete("/:id", auth("admin"), vehicleController.deleteVehiclesId)

export const vehiclesRouter = router