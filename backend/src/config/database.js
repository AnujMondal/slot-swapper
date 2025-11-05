import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Log database configuration for debugging (without exposing password)
console.log("🔍 Database Configuration:");
console.log("  DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("  DATABASE_URL length:", process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
console.log("  DATABASE_URL first 20 chars:", process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) : "undefined");
console.log("  All env keys:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DB_')).join(', '));
console.log("  DB_HOST:", process.env.DB_HOST || "localhost");
console.log("  DB_NAME:", process.env.DB_NAME || "slotswapper");
console.log("  Environment:", process.env.NODE_ENV);

// Support both DATABASE_URL (Render/Heroku) and individual env vars (local)
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === "production" ? {
          require: true,
          rejectUnauthorized: false, // For Render's PostgreSQL
        } : false,
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
