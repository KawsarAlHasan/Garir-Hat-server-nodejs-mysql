const db = require("../config/db");
const { format, add } = require("date-fns");
const transactionService = require("../services/transactionService");

// get all transactions
const getalltransaction = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM transactions");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No Transactions found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All Transactions",
      totalTransactions: data[0].length,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Transactions",
      error,
    });
  }
};

const getalltransactionByVendorId = async (req, res) => {
  try {
    const vendorID = req.params.vendorID;
    const data = await db.query(
      "SELECT * FROM transactions WHERE (vendorID LIKE ? )",
      vendorID
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No Transactions found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All Transactions By Vendor ID",
      totalTransactions: data[0].length,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Transactions",
      error,
    });
  }
};

// create Transaction
const createTransaction = async (req, res, next) => {
  try {
    const {
      vendorID,
      paymentSystem,
      walletNumber,
      amount,
      paymentNumber,
      trxID,
      subcriptionID,
    } = req.body;

    const status = "Panding";

    const [subscription] = await db.query(
      `SELECT * FROM subcriptions WHERE id=?`,
      [subcriptionID]
    );
    const month = subscription[0].month;

    const today = new Date();
    const startDate = format(today, "MMMM dd, yyyy");

    const endDay = add(today, { months: month });
    const endDate = format(endDay, "MMMM dd, yyyy");

    if (
      !vendorID ||
      !paymentSystem ||
      !walletNumber ||
      !amount ||
      !paymentNumber ||
      !trxID ||
      !subcriptionID
    ) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const data = await db.query(
      `INSERT INTO transactions (vendorID, paymentSystem, walletNumber, amount, paymentNumber, trxID, subcriptionID, startDate, endDate, status ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vendorID,
        paymentSystem,
        walletNumber,
        amount,
        paymentNumber,
        trxID,
        subcriptionID,
        startDate,
        endDate,
        status,
      ]
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "Transaction create Successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create Transaction API",
      error,
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transactionID = req.params.id;
    if (!transactionID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide transaction id",
      });
    }
    const { status } = req.body;
    const data = await db.query(
      `UPDATE transactions SET status=? WHERE id =? `,
      [status, transactionID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update transaction ",
      });
    }
    res.status(200).send({
      success: true,
      message: "transaction updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update transaction ",
      error,
    });
  }
};

const updateTransactionStatus = (req, res) => {
  const { id } = req.body;

  transactionService.updateStatusToExpired(id, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to update status" });
    }
    res.json({ message: `Status updated for transaction ID ${id}` });
  });
};

module.exports = {
  getalltransaction,
  getalltransactionByVendorId,
  createTransaction,
  updateTransaction,
  updateTransactionStatus,
};
