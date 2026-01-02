import express, { Request, Response } from "express"
import { authRouters } from "./modules/auth/auth.routes"
import initDB from "./config/db";
import { vehiclesRouter } from "./modules/Vehicles/vehicles.route";
import { userRouter } from "./modules/Users/user.route";
import { bookingsRouter } from "./modules/Bookings/booking.route";

const app = express()
app.use(express.json());
initDB()

app.get('/api/v1', (req: Request, res: Response) => {
    res.send('Hello 👋')
})
app.use("/api/v1/auth", authRouters)

app.use("/api/v1/vehicles", vehiclesRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/bookings", bookingsRouter)



export default app