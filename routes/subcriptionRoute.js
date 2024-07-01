const express = require("express");
const {
  getAllSubcriptions,
  getSubcriptionByID,
  createSubcription,
  deleteSubcription,
  updateSubcription,
} = require("../controllers/subcriptionController");

const router = express.Router();

router.get("/all", getAllSubcriptions); // get all subcription
router.get("/:id", getSubcriptionByID); // get subcription by id
router.post("/create", createSubcription); // create subcription
router.put("/update/:id", updateSubcription); // update subcription
router.delete("/delete/:id", deleteSubcription); // delete subcription

module.exports = router;
