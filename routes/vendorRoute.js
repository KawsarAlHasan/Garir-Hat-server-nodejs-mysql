const express = require("express");
const router = express.Router();
const {
  getAllVendors,
  loginVendor,
  getMeVendor,
  getVendorByID,
  createVendor,
  updateVendor,
  deleteVendor,
  statusUpdate,
  updateVendorPassword,
  nidUpload,
} = require("../controllers/vendorController");
const varifyVendorToken = require("../middleware/varifyVendorToken");
const varifyAdminToken = require("../middleware/varifyAdminToken");
const uploadImage = require("../middleware/uploaderImage");

router.get("/all", varifyAdminToken, getAllVendors); // get all Vendors for admin
router.post("/login", loginVendor); // login
router.get("/me", varifyVendorToken, getMeVendor); // get Vendor by id
router.get("/:id", varifyVendorToken, getVendorByID); // get Vendor by id
router.post("/create", createVendor); // Sign up
router.put(
  "/update",
  uploadImage.single("profilePicture"),
  varifyVendorToken,
  updateVendor
); // update Vendor

router.put(
  "/nid-upload",
  uploadImage.fields([
    { name: "nidCardFront", maxCount: 1 },
    { name: "nidCardBack", maxCount: 1 },
  ]),
  varifyVendorToken,
  nidUpload
);

router.put("/password-change", varifyVendorToken, updateVendorPassword);
router.put("/status/:id", varifyAdminToken, statusUpdate); // status update
router.delete("/delete/:id", varifyAdminToken, deleteVendor); // delete Vendor

module.exports = router;
