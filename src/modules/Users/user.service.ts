import { pool } from "../../config/db"

const getAllUsers = async () => {
    return await pool.query(`SELECT id, name,email,phone, role FROM users`)
}
export const userServices = {
    getAllUsers
}