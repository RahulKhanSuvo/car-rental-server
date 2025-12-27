import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.createUser(req.body)
        res.status(201).json({
            success: true,
            message: "User create successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const signIn = async (req: Request, res: Response) => {
    try {
        const result = await authServices.createUser(req.body)
        res.status(201).json({
            success: true,
            message: "User create successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const authController = {
    signUpUser
}