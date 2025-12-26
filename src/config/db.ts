import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.connection_str,
});

const initDB = async () => {
    // user role enum
    await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'customer');
      END IF;
      IF NOT EXISTS(SELECT 1 FORM pg_type WHERE  typname ='availability_status') THEN CREATE user_role AS ENUM (available', 'booked');
      END IF;

      IF NOT EXISTS(SELECT 1 FORM pg_type WHERE  typname ='vehicle_type') THEN CREATE user_role AS ENUM ('car', 'bike', 'van', 'SUV');
      END IF;
    END$$;
  `);
    // vehicle enums====
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email)),
      password TEXT NOT NULL CHECK (length(password) >= 6),
      phone TEXT NOT NULL,
      role user_role NOT NULL
    );
  `);
    await pool.query(`CREATE TABLE IF NOT EXISTS vehicles(id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, vehicle_name TEXT NOT NULL,
    type vehicle_type NOT NULL,
    daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
    availability_status availability_status NOT NULL DEFAULT 'available'

         );`)
};

export default initDB;
