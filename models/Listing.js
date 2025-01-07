import { DataTypes } from "sequelize"
import sequelize from "../db/connect.js"
import User from "./User.js"
import Category from "./Category.js"
import Application from "./Application.js"
const Listing = sequelize.define(
  "Listing",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary_range: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job_type: {
      type: DataTypes.ENUM("Full-time", "Part-time"),
      allowNull: false,
    },
    application_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "category",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "listings",
  }
)

export default Listing
