import express from "express";
import connetion from "./src/config/connection.js";
import {
  fetchAllData,
  purchaseData,
  finduserinv,
  getUserRec,
} from "./src/invoice/collection.js";
import {
  stockval,
  getTotpay,
  getTotReci,
  getTodayRept,
  getTodayPaymt,
  getTotTaxAmt,
  getdashboard,
} from "./src/stock/collection.js";
import getTaxReport from "./src/report/collection.js";

const app = express();
app.use(express.json());
app.get("/todayPaymt", getTodayPaymt);
app.get("/todayRecipt", getTodayRept);
app.get("/reciable", getTotReci);
app.get("/panding", getTotpay);
app.get("/stockval", stockval);
app.get("/getUserRec", getUserRec);
app.get("/userinv", finduserinv);
app.get("/api/purchase", purchaseData);
app.get("/sales", fetchAllData);
app.get("/getdashboard", getdashboard);
app.get("/getax", getTaxReport);

connetion();
app.listen(4000, () => {
  console.log("server is running on port 4000");
});
