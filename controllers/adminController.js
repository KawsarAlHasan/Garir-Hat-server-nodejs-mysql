const { generateAdminToken } = require("../config/adminToken");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }
    const [results] = await db.query(
      `SELECT * FROM super_admin WHERE email=?`,
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const admin = results[0];

    const isMatch = await bcrypt.compare(password, admin?.password);

    if (!isMatch) {
      return res.status(403).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const token = generateAdminToken(admin);
    const { password: pwd, ...adminWithoutPassword } = admin;
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      data: {
        admin: adminWithoutPassword,
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

// admin update
const adminUpdate = async (req, res) => {
  try {
    const adminID = req?.decodedadmin?.id;

    const { name } = req.body;
    const images = req.file;

    const [adminProfile] = await db.query(
      `SELECT * FROM super_admin WHERE id=?`,
      [adminID]
    );

    let preName = adminProfile[0]?.name;
    if (name) {
      preName = name;
    }

    let proPic = adminProfile[0]?.profilePic;
    if (images && images.path) {
      proPic = `/public/images/${images.filename}`;
    }

    const data = await db.query(
      `UPDATE super_admin SET name=?, profilePic=? WHERE id =? `,
      [preName, proPic, adminID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update admin",
      });
    }
    res.status(200).send({
      success: true,
      message: "admin updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update admin",
      error,
    });
  }
};

// get me admin
const getMeAdmin = async (req, res) => {
  try {
    const decodedadmin = req?.decodedadmin?.id;
    const result = await db.query(`SELECT * FROM super_admin WHERE id=?`, [
      decodedadmin,
    ]);

    res.status(200).json({
      success: true,
      admin: result[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// update admin password
const updateAdminPassword = async (req, res) => {
  try {
    const decodedadmin = req?.decodedadmin?.id;

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(500).json({
        success: false,
        error: "old_password, new_password required in body",
      });
    }

    const [data] = await db.query(
      "SELECT password FROM super_admin WHERE id =?",
      [decodedadmin]
    );

    const checkPassword = data[0]?.password;

    const isMatch = await bcrypt.compare(old_password, checkPassword);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        error: "Your Old Password is not correct",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const [result] = await db.query(
      `UPDATE super_admin SET password=? WHERE id =?`,
      [hashedPassword, decodedadmin]
    );

    if (!result) {
      return res.status(403).json({
        success: false,
        error: "Something went wrong",
      });
    }

    res.status(200).send({
      success: true,
      message: "Admin password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in password Update Admin ",
      error,
    });
  }
};

module.exports = {
  loginAdmin,
  adminUpdate,
  getMeAdmin,
  updateAdminPassword,
};
