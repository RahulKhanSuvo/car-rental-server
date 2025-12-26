import { Request, Response } from "express";

const signUpUse = async (req: Request, res: Response) => {
    console.log(req.body);
    try {

        return res.status(201).json({
            success: true,
            message: "User create successfully",
        })
    } catch (error) {

    }
}
export const authController = {
    signUpUse
}