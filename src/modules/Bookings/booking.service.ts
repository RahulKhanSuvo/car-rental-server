import { pool } from "../../config/db"

const createBooking = async (booking: any) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const result = await client.query(`
      WITH selected_vehicle AS (
        SELECT id, vehicle_name, daily_rent_price
        FROM vehicles
        WHERE id = $1 AND availability_status = 'available'
        FOR UPDATE
      )
      INSERT INTO bookings (
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status
      )
      SELECT
        $2,
        v.id,
        $3::DATE,
        $4::DATE,
        (($4::DATE - $3::DATE) * v.daily_rent_price)::NUMERIC(10,2),
        'active'
      FROM selected_vehicle v
      RETURNING
        id,
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        (SELECT vehicle_name FROM selected_vehicle) AS vehicle_name,
        (SELECT daily_rent_price FROM selected_vehicle) AS daily_rent_price;
    `, [
      booking.vehicle_id,
      booking.customer_id,
      booking.rent_start_date,
      booking.rent_end_date
    ])

    if (result.rows.length === 0) {
      throw new Error("Vehicle not available")
    }

    await client.query(`
      UPDATE vehicles
      SET availability_status = 'booked'
      WHERE id = $1
    `, [booking.vehicle_id])

    await client.query("COMMIT")

    const bookingRow = result.rows[0]

    return {
      id: bookingRow.id,
      customer_id: bookingRow.customer_id,
      vehicle_id: bookingRow.vehicle_id,
      rent_start_date: bookingRow.rent_start_date,
      rent_end_date: bookingRow.rent_end_date,
      total_price: bookingRow.total_price,
      status: bookingRow.status,
      vehicle: {
        vehicle_name: bookingRow.vehicle_name,
        daily_rent_price: bookingRow.daily_rent_price
      }
    }

  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
const getAllBookings = async (user: any) => {
  if (user.role === "admin") {
    return await pool.query(`SELECT * FROM bookings`)
  } else {
    return await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [user.id])
  }
}
export const bookingServices = {
  createBooking,
  getAllBookings
}
