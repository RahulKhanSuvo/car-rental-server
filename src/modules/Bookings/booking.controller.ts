import { Request, Response } from "express"
import { bookingServices } from "./booking.service"


const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body)
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}
const getAllBookings = async (req: Request, res: Response) => {
    const authUser = req.user;
    console.log(authUser);
    try {
        const result = await bookingServices.getAllBookings(authUser)
        return res.status(200).json({
            success: true,
            message: "All bookings retrieved successfully",
            data: result.rows
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}

export const bookingController = {
    createBooking,
    getAllBookings,
}