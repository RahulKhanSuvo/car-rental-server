import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const hashPassword = await bcrypt.hash(password as string, 10)
    return await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *`, [name, email, hashPassword, phone, role])

}
export const authServices = {
    createUser
}