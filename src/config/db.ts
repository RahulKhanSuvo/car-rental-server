import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: config.connection_str,
});

const initDB = async () => {
    await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'customer');
      END IF;
    END$$;
  `);
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
};

export default initDB;
