import { Sequelize, DataTypes, Model } from "sequelize";
import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";
if (environment == "development") {
  dotenv.config({ path: "./.env.development" });
} else dotenv.config({ path: "./.env" });

if (
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_HOST
)
  throw new Error("Environment variables are not set");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() =>
    console.log("Sequelize connection has been established successfully.")
  )
  .catch((error) =>
    console.error("Sequelize was unable to connect to the database:", error)
  );

export default class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, updatedAt: false }
);

Message.sync();
