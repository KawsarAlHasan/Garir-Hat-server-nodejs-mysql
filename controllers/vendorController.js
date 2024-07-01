const db = require("../config/db");
const { generateVendorToken } = require("../config/vendorToken");
const bcrypt = require("bcrypt");

// get all vendors
const getAllVendors = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM vendors");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No vendors found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All vendors",
      totalVendors: data[0].length,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All vendors",
      error,
    });
  }
};

// login vendor
const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }
    const [results] = await db.query(`SELECT * FROM vendors WHERE email=?`, [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const vendor = results[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(vendor?.password, hashedPassword);

    if (!isMatch) {
      return res.status(403).json({
        status: "fail",
        error: "Email and Password is not correct",
      });
    }
    const token = generateVendorToken(vendor);
    const { password: pwd, ...vendorWithoutPassword } = vendor;
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      data: {
        vendor: vendorWithoutPassword,
        token,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "fail",
      message: "Vendor Login Unseccess",
      error: error.message,
    });
  }
};

// get me vendor
const getMeVendor = async (req, res) => {
  try {
    const decodedvendor = req?.decodedvendor?.email;
    const result = await db.query(`SELECT * FROM vendors WHERE email=?`, [
      decodedvendor,
    ]);

    res.status(200).json({
      success: true,
      vendor: result[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// get vendor by id
const getVendorByID = async (req, res) => {
  try {
    const vendorID = req.params.id;
    if (!vendorID) {
      return res.status(404).send({
        success: false,
        message: "Invalid or missing vendor ID",
      });
    }
    const data = await db.query(`SELECT * FROM vendors WHERE id=?`, [vendorID]);
    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No vendor found",
      });
    }
    const vendor = data[0];
    res.status(200).send(vendor[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting vendor",
      error,
    });
  }
};

// // create vendor
const createVendor = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      about,
      companyName,
      businessLisence,
      status,
      contactNumber,
      emergencyPhoneNum,
      nidCardFront,
      nidCardBack,
    } = req.body;

    const profilePicture = req.file.path.replace(/\\/g, "/");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !contactNumber ||
      !nidCardFront
    ) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const data = await db.query(
      `INSERT INTO vendors (firstName, lastName, email, password,  about, companyName, businessLisence, status, contactNumber, emergencyPhoneNum, profilePicture, nidCardFront, nidCardBack  ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        password,
        about,
        companyName,
        businessLisence,
        status,
        contactNumber,
        emergencyPhoneNum,
        profilePicture,
        nidCardFront,
        nidCardBack,
      ]
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "vendor create Successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create vendor API",
      error,
    });
  }
};

// update vendor
const updateVendor = async (req, res) => {
  try {
    const vendorID = req.params.id;
    if (!vendorID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide vendor id",
      });
    }
    const {
      firstName,
      lastName,
      emergencyPhoneNum,
      about,
      companyName,
      businessLisence,
      profilePicture,
    } = req.body;
    const data = await db.query(
      `UPDATE vendors SET firstName=?, lastName=?, emergencyPhoneNum=?, about=?, companyName=?, businessLisence=?, profilePicture=? WHERE id =? `,
      [
        firstName,
        lastName,
        emergencyPhoneNum,
        about,
        companyName,
        businessLisence,
        profilePicture,
        vendorID,
      ]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update vendor ",
      });
    }
    res.status(200).send({
      success: true,
      message: "vendor  updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update vendor ",
      error,
    });
  }
};

// // // delete vendor
const deleteVendor = async (req, res) => {
  try {
    const vendorID = req.params.id;
    if (!vendorID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide vendor  id",
      });
    }

    await db.query(`DELETE FROM vendors WHERE id=?`, [vendorID]);
    res.status(200).send({
      success: true,
      message: "vendor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete vendor",
      error,
    });
  }
};

module.exports = {
  getAllVendors,
  loginVendor,
  getMeVendor,
  getVendorByID,
  createVendor,
  updateVendor,
  deleteVendor,
};
