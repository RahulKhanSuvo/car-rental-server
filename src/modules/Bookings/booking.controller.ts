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
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: (error as Error).message
        })
    }
}
const updateBookingById = async (req: Request, res: Response) => {
    const autUser = req.user;
    console.log(autUser);
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await bookingServices.updateBookingById(id as string, status, autUser);
        return res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: result
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
    updateBookingById
}