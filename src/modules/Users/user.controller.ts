import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
    try {
        res.status(201).json({
            success: true,
            message: "User"
        })
    } catch (error) {

    }
}