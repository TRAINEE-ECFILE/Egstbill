import express from "express";
import mongoose from "mongoose";
import userSalesInv from "./module.js";
import userPurchaseInv from "./pur_module.js";

const fetchAllData = async (req, res) => {
  try {
    const docs = await userSalesInv.aggregate([
      {
        $match: {
          "data.invoiceDate": {
            $gte: "2023-11-30",
            $lte: "2024-12-03",
          },
        },
      },
      {
        $group: { _id: null, Anuual_inv_Amt: { $sum: "$data.totalInvValue" } },
      },
    ]);
    const result = docs.map((i) => {
      console.log(i.Anuual_inv_Amt);
      return `Amount:${i.Anuual_inv_Amt}`;
    });
    // const docs = await userSalesInv.find();
    // const result = docs.map((i) => {
    //   // console.log(i.);
    //   return i.data.invoiceDate;
    // });

    !docs
      ? res.status(400).json({ message: "data not found" })
      : res.status(200).json(result);
    // mongoose.deleteModel("sales_invs");
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error fetching data:", err.message);
  }
};

const purchaseData = async (req, res) => {
  try {
    const docs = await userPurchaseInv.aggregate([
      {
        $match: {
          "data.invoiceDate": {
            $gte: "2023-11-30",
            $lte: "2024-12-03",
          },
        },
      },
      {
        $group: { _id: null, Anuual_inv_Amt: { $sum: "$data.totalInvValue" } },
      },
    ]);
    const result = docs.map((i) => {
      console.log(i.Anuual_inv_Amt);
      return `Amount:${i.Anuual_inv_Amt}`;
    });

    // const docs = await userSalesInv.find();
    // const result = docs.map((i) => {
    //   // console.log(i.);
    //   return i.data.invoiceDate;
    // });
    !docs
      ? res.status(400).json({ message: "data not found" })
      : res.status(200).json(result);
    // res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log("Error fetching data:", err);
  }
};

const finduserinv = async (req, res) => {
  try {
    console.log(req.body.params);

    const value = await userSalesInv.aggregate([
      {
        $unwind: "$data.invoiceItems",
      },
      {
        $group: {
          _id: "$data.selectedCustomer",
          totalPriceSum: { $sum: "$data.invoiceItems.totalPrice" },
        },
      },
    ]);
    res.status(200).json(value);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

export { fetchAllData, purchaseData, finduserinv };
