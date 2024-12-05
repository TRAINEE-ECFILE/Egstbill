import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { ecgst } from "../../config/db.js";
// dotenv.config();

const Schema = mongoose.Schema;

const userSalesInvSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: false,
    },

    clientId: {
      type: Schema.Types.ObjectId,
      ref: "client",
      unique: false,
    },
    bankCashAccId: {
      type: Schema.Types.ObjectId,
      ref: "bank_cash_acc",
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
    opt_process: Object,
  },
  {
    timestamps: true,
  }
);

const userSalesInv = mongoose.model("sales_inv", userSalesInvSchema);

export default userSalesInv;
