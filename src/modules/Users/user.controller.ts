import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsers()
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const updateUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const authUser = req.user
    if (!authUser) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    const { name, email, phone, role } = req.body
    if (authUser.role !== "admin" && authUser.id !== id) {
        return res.status(401).json({
            success: false,
            message: "You can update only your own profile"
        })
    }
    if (authUser.role !== "admin" && role) {
        return res.status(403).json({
            success: false,
            message: "You cannot change role",
        });
    }
    try {
        const result = await userServices.updateUserById(id!, name, email, phone, role)
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, status: 404, message: "User not found" })
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const userController = {
    getAllUsers, updateUserById
}