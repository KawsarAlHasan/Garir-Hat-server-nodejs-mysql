const express = require("express");
const {
  getAllProducts,
  getProductByID,
  createProducts,
  updateProducts,
  deleteProducts,
} = require("../controllers/productController");
const uploadImage = require("../middleware/uploaderImage");

const router = express.Router();

router.get("/all", getAllProducts); // get all products
router.get("/:id", getProductByID); // get product by id
router.post(
  "/create",
  uploadImage.fields([{ name: "images", maxCount: 10 }]),
  createProducts
); // create product
router.put("/update/:id", updateProducts); // update product
router.delete("/delete/:id", deleteProducts); // delete product

module.exports = router;
