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
} = require("../controllers/vendorController");
const varifyVendorToken = require("../middleware/varifyVendorToken");
const uploadImage = require("../middleware/uploaderImage");

router.get("/all", getAllVendors); // get all Vendors
router.post("/login", loginVendor); // get Vendor by id
router.get("/me", varifyVendorToken, getMeVendor); // get Vendor by id
router.get("/:id", getVendorByID); // get Vendor by id
router.post("/create", uploadImage.single("image"), createVendor); // create Vendor
router.put("/update/:id", updateVendor); // update Vendor
router.delete("/delete/:id", deleteVendor); // delete Vendor

module.exports = router;
