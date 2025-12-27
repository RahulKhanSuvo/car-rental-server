import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";
const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const hashPassword = await bcrypt.hash(password as string, 10)
    return await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *`, [name, email, hashPassword, phone, role])

}
const signIn = async (payload: Record<string, unknown>) => {
    const { email, password } = payload;
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    if (result.rows.length === 0) {
        throw new Error("Invalid email or password")
    }
    const user = result.rows[0]
    const match = await bcrypt.compare(password as string, user.password)
    if (!match) {
        throw new Error("Invalid email or password")
    }
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, config.jwtSecret as string, { expiresIn: "1d" })
    const { password: _, ...safeUser } = user
    return { token, safeUser }
}
export const authServices = {
    createUser, signIn
}