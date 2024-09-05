const express = require("express");
const {
  loginAdmin,
  adminUpdate,
  getMeAdmin,
  updateAdminPassword,
} = require("../controllers/adminController");
const varifyAdminToken = require("../middleware/varifyAdminToken");
const uploadImage = require("../middleware/uploaderImage");

const router = express.Router();

router.post("/login", loginAdmin);
router.put(
  "/update",
  uploadImage.single("profilePic"),
  varifyAdminToken,
  adminUpdate
);
router.get("/me", varifyAdminToken, getMeAdmin);
router.get("/password-change", varifyAdminToken, updateAdminPassword);

module.exports = router;
