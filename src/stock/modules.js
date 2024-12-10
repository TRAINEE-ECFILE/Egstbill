import mongoose from "mongoose";
import dotenv from "dotenv";
// import { ecgst } from "../../config/db.js";
// dotenv.config();

const Schema = mongoose.Schema;

const userStockSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: false,
    },
    title: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
      unique: true,
    },
    data: {
      type: Object,
      required: true,
    },
    createdDate: {
      type: String,
      required: true,
    },
    updatedDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userStock = mongoose.model("stock", userStockSchema);

export default userStock;
