const express = require("express");
const {
  getAllUsers,
  loginUser,
  getMeUser,
  getUserByID,
  signupUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  userStatusUpdate,
} = require("../controllers/userController");
const varifyUserToken = require("../middleware/varifyUserToken");
const uploadImage = require("../middleware/uploaderImage");

const router = express.Router();

router.get("/all", getAllUsers); // get all users
router.post("/login", loginUser); // get user by id
router.get("/me", varifyUserToken, getMeUser); // get user by id
router.get("/:id", getUserByID); // get user by id
router.post("/signup", signupUser); // create user
router.put(
  "/update",
  uploadImage.single("profilePic"),
  varifyUserToken,
  updateUser
); // update user
router.delete("/delete/:id", deleteUser); // delete user

router.put("/password-change", varifyUserToken, updateUserPassword);
router.put("/status/:id", userStatusUpdate); // status update

module.exports = router;
