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
  let query = `
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'name', u.name,
        'email', u.email
      ) AS customer,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number
      ) AS vehicle
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
  `

  let values: any[] = []

  if (user.role !== "admin") {
    query += ` WHERE b.customer_id = $1`
    values.push(user.id)
  }

  query += ` ORDER BY b.id DESC`

  const result = await pool.query(query, values)
  return result.rows
}
const updateBookingById = async (id: string, status: string, authUser: any) => {
  // 1️⃣ Fetch the booking first
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
  const booking = bookingResult.rows[0];
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (
    (status === "returned" && authUser.role !== "admin") ||
    (status === "cancelled" && authUser.role !== "admin" && authUser.id !== booking.customer_id)
  ) {
    throw new Error("Unauthorized");
  }

  const updatedBookingResult = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );
  const updatedBooking = updatedBookingResult.rows[0];

  let vehicleUpdate = null;

  if (status === "returned") {
    vehicleUpdate = await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1 RETURNING availability_status`,
      [booking.vehicle_id]
    );
  }


  return {
    success: true,
    message:
      status === "returned"
        ? "Booking marked as returned. Vehicle is now available"
        : "Booking cancelled successfully",
    data: {
      ...updatedBooking,
      vehicle: vehicleUpdate ? vehicleUpdate.rows[0] : undefined,
    },
  };
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingById
}
