const express = require("express");
const {
  getalltransaction,
  getalltransactionByVendorId,
  createTransaction,
  updateTransaction,
  updateTransactionStatus,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/all", getalltransaction); // get all transaction
router.get("/all/:vendorID", getalltransactionByVendorId); // get transaction by vendor id
router.post("/create", createTransaction); // create Transaction
router.put("/update/:id", updateTransaction); // update transaction by admin
router.post("/update-status", updateTransactionStatus); // update transaction

module.exports = router;
