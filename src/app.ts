import express, { Request, Response } from "express"
import { authRouters } from "./modules/auth/auth.routes"
import initDB from "./config/db";

const app = express()
app.use(express.json());
initDB()

app.get('/api/v1', (req: Request, res: Response) => {
    res.send('Hello 👋')
})
app.use("/api/v1/auth", authRouters)
// app.use("/users",)


export default app