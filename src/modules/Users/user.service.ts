import { pool } from "../../config/db"

const getAllUsers = async () => {
    return await pool.query(`SELECT id, name,email,phone, role FROM users`)
}
const updateUserById = async (id: string, name: string, email: string, phone: string, role: string) => {
    return await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id, name, email, phone, role`, [name, email, phone, role, id])
}
const deleteUserById = async (id: string) => {
    return await pool.query(`DELETE FROM users WHERE id=$1`, [id])
}
export const userServices = {
    getAllUsers, updateUserById, deleteUserById
}