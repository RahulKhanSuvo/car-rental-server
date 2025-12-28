import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vehicleServices.createVehicle(req.body)
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            date: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicles()
        if (result.rows.length === 0)
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            })
        return res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const getVehiclesById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await vehicleServices.getVehiclesById(id as string)
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "vehicles not found"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows[0]
            })
        }

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const updateVehiclesBuId = async (req: Request, res: Response) => {
    const { id } = req.params
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status, } = req.body
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Vehicle id is required"
        });
    }
    try {
        const result = await vehicleServices.updateVehiclesBuId(id!, vehicle_name, type, registration_number, daily_rent_price, availability_status,)

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "vehicles not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: result.rows[0]
            })
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const deleteVehiclesId = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Vehicle id is required"
        });
    }
    try {

        const result = await vehicleServices.deleteVehiclesId(id)
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "vehicles not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
            })
        }

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const vehicleController = {
    createVehicle, getAllVehicles, getVehiclesById, updateVehiclesBuId, deleteVehiclesId
}