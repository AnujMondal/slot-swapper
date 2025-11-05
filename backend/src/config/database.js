import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Log database configuration for debugging (without exposing password)
console.log("🔍 Database Configuration:");
console.log("  DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("  DB_HOST:", process.env.DB_HOST || "localhost");
console.log("  DB_NAME:", process.env.DB_NAME || "slotswapper");
console.log("  Environment:", process.env.NODE_ENV);

// Support both DATABASE_URL (Render/Heroku) and individual env vars (local)
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // For Render's PostgreSQL
        },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize(
      process.env.DB_NAME || "slotswapper",
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "postgres",
      {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        dialect: "postgres",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );

export default sequelize;
