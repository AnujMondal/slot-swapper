import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SwapRequest = sequelize.define(
  "SwapRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requesterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    requesterSlotId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    receiverSlotId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("PENDING", "ACCEPTED", "REJECTED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "swap_requests",
    timestamps: true,
    indexes: [
      {
        fields: ["requesterId"],
      },
      {
        fields: ["receiverId"],
      },
      {
        fields: ["status"],
      },
    ],
  }
);

export default SwapRequest;
