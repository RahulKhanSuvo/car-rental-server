import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router()
router.post("/", auth("admin", "customer"), bookingController.createBooking)
export const bookingsRouter = router