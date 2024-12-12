import express from "express";
import mongoose from "mongoose";
import userStock from "./modules.js";
import userSalesInv from "../invoice/module.js";
import userPurchaseInv from "../invoice/pur_module.js";

const stockval = async (req, res) => {
  try {
    const reqId = "6732eb433a32c6ef1adc7de0";
    const startdate = "2023-11-27 ";
    const enddate = "2024-12-06";
    const stock_data = await userStock.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(reqId),
          //   createdDate: {
          //     $gte: new Date(startdate),
          //     $lte: new Date(enddate),
          //   },
        },
      },
      {
        $group: {
          _id: null,
          stockValue: { $sum: "$data.value" },
        },
      },
    ]);
    if (stock_data?.length <= 0) {
      return res.status(400).json({ message: "data not found" });
    }
    const stockValue = stock_data[0].stockValue;

    res.status(200).json({ stockValue });
  } catch (error) {
    console.log(error);

    res.status(500).json({ messgae: error.messgae });
  }
};

const getTotpay = async (req, res) => {
  try {
    const reqId = "6732eb433a32c6ef1adc7de0";
    const startdate = "2024-05-01";
    const enddate = "2024-12-06";
    const stock_data = await userPurchaseInv.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(reqId),
          createdDate: {
            $gte: new Date(startdate),
            $lte: new Date(enddate),
          },
        },
      },
      {
        $group: {
          _id: null,
          payaple: { $sum: "$data.pendingAmount" },
        },
      },
    ]);
    if (stock_data?.length <= 0) {
      return res.status(400).json({ message: "data not found" });
    }
    console.log(stock_data);
    res.status(200).json({ stock_data });
  } catch (error) {
    console.log(error);

    res.status(500).json({ messgae: error.messgae });
  }
};

const getTotReci = async (req, res) => {
  try {
    const reqId = "6732eb433a32c6ef1adc7de0";
    const startdate = "2024-11-27 ";
    const enddate = "2024-12-06";
    const stock_data = await userSalesInv.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(reqId),
          //   createdDate: {
          //     $gte: new Date(startdate),
          //     $lte: new Date(enddate),
          //   },
        },
      },
      {
        $group: {
          _id: null,
          reciable: { $sum: "$data.pendingAmount" },
        },
      },
    ]);
    if (stock_data?.length <= 0) {
      return res.status(400).json({ message: "data not found" });
    }
    console.log(stock_data);
    res.status(200).json({ stock_data });
  } catch (error) {
    console.log(error);

    res.status(500).json({ messgae: error.messgae });
  }
};

const getTodayRept = async (req, res) => {
  try {
    // type_of_mode = "Credit";
    const reciept_data = await userSalesInv.aggregate([
      {
        $match: {
          "opt_process.date": {
            $gte: new Date("$data.invoiceDate"),
            $lte: new Date(),
          },
          "data.pendingAmount": { $gt: 0 },
          "data.modeOfPayment": "Credit",
        },
      },
      {
        $project: {
          _id: null,
          invoiceDate: "$data.invoiceDate",
          paymentTerms: "$data.paymentTerms",
          pendingAmount: "$data.pendingAmount",
        },
      },
    ]);
    if (paymt_data?.length <= 0) {
      res.status(400).json({ massage: "data not found" });
    }
    const pendingAmount = reciept_data[0].reciept_data;

    res.status(200).json(pendingAmount);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: "internal server error" });
  }
};

const getTodayPaymt = async (req, res) => {
  try {
    const paymt_data = await userPurchaseInv.aggregate([
      {
        $match: {
          "opt_process.date": {
            $gte: new Date("$data.invoiceDate"),
            $lte: new Date(),
          },
          "data.pendingAmount": { $gt: 0 },
          "data.modeOfPayment": "Credit",
        },
      },
      {
        $project: {
          _id: null,
          invoiceDate: "$data.invoiceDate",
          paymentTerms: "$data.paymentTerms",
          pendingAmount: "$data.pendingAmount",
        },
      },
    ]);
    if (paymt_data?.length <= 0) {
      res.status(400).json({ massage: "data not found" });
    }
    // const pendingAmount = reciept_data.map((i) => {
    //   i;
    // });

    // console.log(paymt_data);
    res.status(200).json(paymt_data[0]);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

const getTotTaxAmt = async (req, res) => {
  try {
    const client = new mongoose.Types.ObjectId("6728678eb75576b89384c536");
    const tax_data = await userSalesInv.aggregate([
      {
        $project: {
          clientId: new mongoose.Types.ObjectId("6728678eb75576b89384c536"),
          taxObject: "$opt_process.tax",
        },
      },
      {
        $unionWith: {
          coll: "purchase_invs", // 1 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$opt_process.tax",
              },
            },
          ],
        },
        $unionWith: {
          coll: "sales_invs", // 2 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "debit_notes", // 3 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },

        $unionWith: {
          coll: "credit_notes", // 4 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },
        $unionWith: {
          coll: "expenses", // 5 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },
        $unionWith: {
          coll: "incomes", // 6 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },
        $unionWith: {
          coll: "estimates_invs", // 7 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },
        $unionWith: {
          coll: "purchase_orders", // 8 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },
        $unionWith: {
          coll: "proforma_invs", // 9 coll
          pipeline: [
            {
              $project: {
                clientId: new mongoose.Types.ObjectId(
                  "6728678eb75576b89384c536"
                ),
                taxObject: "$data.tax", // Adjust path if receipts have a different tax structure
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$clientId",
          taxData: { $push: "$taxObject" }, // Collect all tax objects for each client
        },
      },
    ]);

    // console.log(tax_data);
    res.status(200).json(tax_data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ messgae: error.messgae });
  }
};

const getdashboard = async (req, res) => {
  try {
    const id = "66389e368d8bc611a5603eeb";

    let { startDate, endDate } = req.query;
    console.log(new Date(startDate), "===", new Date(endDate));
    const lastYear = new Date(startDate);

    const currentYear = new Date(endDate);
    let match = {
      userId: new mongoose.Types.ObjectId(id),
      "opt_process.date": {
        $gte: lastYear,
        $lte: currentYear,
      },
    };
    // console.log(currentYear);
    const result = await userSalesInv.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: null,
          totSalesAmt: { $sum: "$data.totalInvValue" },
          salesReceivedAmt: { $sum: "$data.pendingAmount" },
        },
      },
      // purchase value
      {
        $unionWith: {
          coll: "purchase_invs",
          pipeline: [
            {
              $match: match,
            },
            {
              $group: {
                _id: null,
                totPurchAmt: { $sum: "$data.totalInvValue" },
                purchasePaidAmt: { $sum: "$data.pendingAmount" },
              },
            },
          ],
        },
      },
      // stock value
      {
        $unionWith: {
          coll: "stocks",
          pipeline: [
            {
              $match: {
                userId: new mongoose.Types.ObjectId(id),
                createdAt: {
                  $gte: lastYear,
                  $lte: currentYear,
                },
              },
            },
            {
              $group: {
                _id: null,
                stockValue: { $sum: "$data.value" },
              },
            },
          ],
        },
      },
      // today recipt\/
      {
        $unionWith: {
          coll: "sales_invs",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$opt_process.date",
                    {
                      $dateSubtract: {
                        startDate: "$$NOW",
                        unit: "day",
                        amount: "$data.paymentTerms",
                      },
                    },
                  ],
                },
                "data.pendingAmount": { $gt: 0 },
                "data.modeOfPayment": "Credit",
              },
            },
            {
              $project: {
                _id: 0,
                source: "Sales",
                invoiceDate: "$data.invoiceDate",
                paymentTerms: "$data.paymentTerms",
                invoiceNo: "$data.invoiceNo",
                amount: "$data.pendingAmount",
              },
            },
          ],
        },
      },
      // today payments\/
      {
        $unionWith: {
          coll: "purchase_invs",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$opt_process.date",
                    {
                      $dateSubtract: {
                        startDate:"$$NOW",
                        unit: "day",
                        amount: "$data.paymentTerms",
                      },
                    },
                  ],
                },
                "data.pendingAmount": { $gt: 0 },
                "data.modeOfPayment": "Credit",
              },
            },
            {
              $project: {
                _id: 0,
                source: "Purchase",
                invoiceDate: "$data.invoiceDate",
                paymentTerms: "$data.paymentTerms",
                invoiceNo: "$data.invoiceNo",
                amount: "$data.pendingAmount",
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          sales: { $max: "$totSalesAmt" },
          recivable: { $max: "$salesReceivedAmt" },
          purchase: { $max: "$totPurchAmt" },
          payable: { $max: "$purchasePaidAmt" },
          stock: { $max: "$stockValue" },
          salesInvoices: {
            $push: {
              $cond: [
                { $eq: ["$source", "Sales"] },
                {
                  invoiceDate: "$invoiceDate",
                  invoiceNo: "$invoiceNo",
                  paymentTerms: "$paymentTerms",
                  pendingAmount: "$amount",
                },
                null,
              ],
            },
          },
          purchaseInvoices: {
            $push: {
              $cond: [
                { $eq: ["$source", "Purchase"] },
                {
                  invoiceDate: "$invoiceDate",
                  invoiceNo: "$invoiceNo",
                  paymentTerms: "$paymentTerms",
                  // pendingAmount: "$pendingAmount",
                  pendingAmount: "$amount",
                },
                null,
              ],
            },
          },
          salestotal: {
            $sum: "$salesInvoices.pendingAmount",
          },
          purchasetotal: {
            $sum: "$purchaseInvoices.pendingAmount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          sales: 1,
          recivable: 1,
          purchase: 1,
          payable: 1,
          stock: 1,
          totalSalesPending: {
            $sum: "$salesInvoices.pendingAmount",
          },
          totalPurchasePending: {
            $sum: "$purchaseInvoices.pendingAmount",
          },
          salesInvoices: {
            $filter: {
              input: "$salesInvoices",
              as: "item",
              cond: { $ne: ["$$item", null] },
            },
          },
          purchaseInvoices: {
            $filter: {
              input: "$purchaseInvoices",
              as: "item",
              cond: { $ne: ["$$item", null] },
            },
          },
        },
      },
    ]);

    // console.log(result);

    if (result?.length <= 0) {
      res.status(400).json({ messgae: "data not found" });
    }
    const output = result[0];
    // console.log(result);
    res.status(200).json(output);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export {
  stockval,
  getTotpay,
  getTotReci,
  getTodayRept,
  getTodayPaymt,
  getTotTaxAmt,
  getdashboard,
};
