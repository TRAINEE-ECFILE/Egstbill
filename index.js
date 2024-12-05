import express from "express";
import connetion from "./src/config/connection.js";
import { fetchAllData, purchaseData, finduserinv } from "./src/collection.js";
const app = express();
app.use(express.json());
app.get("/userinv", finduserinv);
app.get("/api/purchase", purchaseData);
app.get("/sales", fetchAllData);
connetion();
app.listen(4000, () => {
  console.log("server is running on port 4000");
});
