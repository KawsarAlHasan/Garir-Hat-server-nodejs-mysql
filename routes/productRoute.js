const express = require("express");
const {
  getCheck,
  getAllProducts,
  getProductByID,
  createProducts,
  updateImagesProducts,
  updateProducts,
  deleteProducts,
} = require("../controllers/productController");
const uploadImage = require("../middleware/uploaderImage");

const router = express.Router();

router.get("/check", getCheck); // get all products
router.get("/all", getAllProducts); // get all products
router.get("/:id", getProductByID); // get product by id
router.post("/create", uploadImage.array("images", 10), createProducts); // create product
router.put(
  "/update/images/:id",
  uploadImage.array("images", 10),
  updateImagesProducts
); // update product
router.put("/update/:id", updateProducts); // update product
router.delete("/delete/:id", deleteProducts); // delete product

module.exports = router;
