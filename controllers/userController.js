const db = require("../config/db");
const { generateUserToken } = require("../config/userToken");
const bcrypt = require("bcrypt");

// get all users
const getAllUsers = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM user");

    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No User found",
        data: data,
      });
    }

    res.status(200).send({
      success: true,
      message: "All Users",
      totalUsers: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Users",
      error: error.message,
    });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }
    const [results] = await db.query(`SELECT * FROM user WHERE email=?`, [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const user = results[0];

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.status(403).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const token = generateUserToken(user);
    const { password: pwd, ...userWithoutPassword } = user;
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "fail",
      message: "Admin Login Unseccess",
      error: error.message,
    });
  }
};

// user get me
const getMeUser = async (req, res) => {
  try {
    const userID = req?.decodeduser?.id;
    const [result] = await db.query(`SELECT * FROM user WHERE id=?`, [userID]);

    if (!result || result.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No user found",
        data: result,
      });
    }

    res.status(200).json({
      success: true,
      user: result[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error in get me user",
      error: error.message,
    });
  }
};

// get user by id
const getUserByID = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!userID) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide user id",
      });
    }
    const [data] = await db.query(`SELECT * FROM user WHERE id=?`, [userID]);
    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No user found",
        user: data[0],
      });
    }
    res.status(200).send({
      success: true,
      message: "Get Single User",
      user: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get User",
      error: error.message,
    });
  }
};

// create user
const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(500).send({
        success: false,
        message: "name, email, password is required in body",
      });
    }

    // Check if email already exists
    const [checkEmail] = await db.query(`SELECT * FROM user WHERE email=?`, [
      email,
    ]);

    const checkVendor = checkEmail[0];

    if (checkVendor == undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [data] = await db.query(
        `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword]
      );
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Error in INSERT QUERY",
        });
      }

      const [userInfo] = await db.query(`SELECT * FROM user WHERE email=?`, [
        email,
      ]);
      const user = userInfo[0];

      const token = generateUserToken(user);
      const { password: pwd, ...userWithoutPassword } = user;

      res.status(200).send({
        success: true,
        message: "User Signup Successfully",
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Email already registered",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create User API",
      error: error.message,
    });
  }
};

// update user
const updateUser = async (req, res) => {
  try {
    const userID = req?.decodeduser?.id;

    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(500).send({
        success: false,
        message: "name, phone is required in body",
      });
    }

    const images = req.file;

    const [userProfile] = await db.query(`SELECT * FROM user WHERE id=?`, [
      userID,
    ]);

    let proPic = userProfile[0]?.profilePic;
    if (images && images.path) {
      proPic = `/public/images/${images.filename}`;
    }

    const data = await db.query(
      `UPDATE user SET name=?, phone=?, profilePic=? WHERE id =? `,
      [name, phone, proPic, userID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update user",
      });
    }
    res.status(200).send({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update User",
      error: error.message,
    });
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!userID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide user id",
      });
    }

    const [data] = await db.query(`SELECT * FROM user WHERE id=?`, [userID]);
    if (!data || data.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No user found",
      });
    }

    await db.query(`DELETE FROM user WHERE id=?`, [userID]);
    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete User",
      error: error.message,
    });
  }
};

// update user password
const updateUserPassword = async (req, res) => {
  try {
    const userID = req?.decodeduser?.id;

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(500).json({
        success: false,
        error: "old_password, new_password required in body",
      });
    }

    const [data] = await db.query("SELECT password FROM user WHERE id =?", [
      userID,
    ]);

    const checkPassword = data[0]?.password;

    const isMatch = await bcrypt.compare(old_password, checkPassword);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        error: "Your Old Password is not correct",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const [result] = await db.query(`UPDATE user SET password=? WHERE id =?`, [
      hashedPassword,
      userID,
    ]);

    if (!result) {
      return res.status(403).json({
        success: false,
        error: "Something went wrong",
      });
    }

    res.status(200).send({
      success: true,
      message: "user password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in password Update user ",
      error: error.message,
    });
  }
};

// status update
const userStatusUpdate = async (req, res) => {
  try {
    const userID = req.params.id;
    if (!userID) {
      return res.status(404).send({
        success: false,
        message: "userID is required in params",
      });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(500).send({
        success: false,
        message: "status is required in body",
      });
    }

    // Fixed SQL query with missing comma
    const data = await db.query(`UPDATE user SET status=? WHERE id=?`, [
      status,
      userID,
    ]);

    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in status updating user",
      });
    }

    res.status(200).send({
      success: true,
      message: "user status updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in status updating user",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  loginUser,
  getMeUser,
  getUserByID,
  signupUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  userStatusUpdate,
};
