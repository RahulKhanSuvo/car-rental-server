import { pool } from "../../config/db"

const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload
    return await pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status])

}
const getAllVehicles = async () => {
    return await pool.query(`SELECT * FROM vehicles`)
}
const getVehiclesById = async (id: string) => {
    return await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id])
}
const updateVehiclesBuId = async (id: string, vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) => {
    return await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id])
}
const deleteVehiclesId = async (id: string) => {
    return await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id])
}
export const vehicleServices = {
    createVehicle, getAllVehicles, getVehiclesById, updateVehiclesBuId, deleteVehiclesId
}