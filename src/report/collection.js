import express from "express";
import mongoose from "mongoose";
// import userStock from "./modules.js";
import userSalesInv from "../invoice/module.js";
// import userPurchaseInv from "../invoice/pur_module.js";

const getTaxReport = async (req, res) => {
  try {
    let { userId, clientId, dataId, type } = req.query;

    const user = new ObjectId(userId);
    // const clientId = "6725bdae624593d969db0e61";
    // const dataId = "672862e1b75576b89384c2fd";
    console.log(type);
    
    let db;

    if (type === "userSalesInv") {
      db = userSalesInv;
    }
    console.log(db);

    const tax_data = await db.aggregate([
      {
        $match: {
          userId: user,
          "data.clientId": clientId,
          dataId: dataId,
        },
      },
      {
        $project: {
          _id: 0,
          taxObject: "$opt_process.tax", // Projecting the 'tax' field into 'taxObject'
        },
      },
      {
        $group: {
          _id: null, // Grouping everything into one result
          taxData: { $first: "$taxObject" }, // Use $first to extract the first value of taxObject
        },
      },
    ]);

    const result = tax_data[0];
    res.status(200).json(tax_data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messgae: error.messgae });
  }
};

export default getTaxReport;
