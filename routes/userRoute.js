const express = require("express");
const {
  getAllUsers,
  loginUser,
  getMeUser,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const varifyUserToken = require("../middleware/varifyUserToken");

const router = express.Router();

router.get("/all", getAllUsers); // get all users
router.post("/login", loginUser); // get user by id
router.get("/me", varifyUserToken, getMeUser); // get user by id
router.get("/:id", getUserByID); // get user by id
router.post("/create", createUser); // create user
router.put("/update/:id", updateUser); // update user
router.delete("/delete/:id", deleteUser); // delete user

module.exports = router;
