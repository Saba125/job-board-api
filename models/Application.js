import sequelize from "../db/connect.js"
import { DataTypes } from "sequelize"
import User from "./User.js"
import Listing from "./Listing.js"
const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Under Review",
        "Interview Scheduled",
        "Accepted",
        "Rejected"
      ),
      allowNull: false,
      defaultValue: "Pending",
    },
    listing_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "listings",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    resume_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "application",
    timestamps: true,
  }
)

export default Application
