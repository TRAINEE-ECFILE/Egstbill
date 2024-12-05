import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connetion = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

export default connetion;
