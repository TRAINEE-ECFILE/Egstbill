import express from "express";
import mongoose from "mongoose";
import userSalesInv from "./module.js";
import userPurchaseInv from "./pur_module.js";

const fetchAllData = async (req, res) => {
  try {
    const startdate = "2023-11-30";
    const enddate = "2024-12-05";
    const docs = await userSalesInv.aggregate([
      {
        $match: {
          "data.invoiceDate": {
            $gte: startdate,
            $lte: enddate,
          },
        },
      },
      {
        $group: { _id: null, totalInvValue: { $sum: "$data.totalInvValue" } },
      },
    ]);
    console.log(docs);
    const amount = docs[0].totalInvValue;

    !docs
      ? res.status(400).json({ message: "data not found" })
      : res.status(200).json({ amount });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error fetching data:", err.message);
  }
};

const purchaseData = async (req, res) => {
  try {
    const startdate = "2023-11-30";
    const enddate = "2024-12-05";
    const docs = await userPurchaseInv.aggregate([
      {
        $match: {
          "data.invoiceDate": {
            $gte: startdate,
            $lte: enddate,
          },
        },
      },
      {
        $group: { _id: null, totalInvValue: { $sum: "$data.totalInvValue" } },
      },
    ]);

    const result = docs[0].totalInvValue;
    !docs
      ? res.status(400).json({ message: "data not found" })
      : res.status(200).json(result);
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
