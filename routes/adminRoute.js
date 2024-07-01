const express = require("express");
const {
  loginAdmin,
  adminUpdate,
  getMeAdmin,
} = require("../controllers/adminController");
const varifyAdminToken = require("../middleware/varifyAdminToken");

const router = express.Router();

router.post("/login", loginAdmin);
router.put("/:id", adminUpdate);
router.get("/me", varifyAdminToken, getMeAdmin);

module.exports = router;
