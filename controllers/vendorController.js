const db = require("../config/db");
const { generateVendorToken } = require("../config/vendorToken");
const bcrypt = require("bcrypt");

// get all vendors
const getAllVendors = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM vendors");
    if (!data || data.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No Vendor found",
        data: data,
      });
    }

    res.status(200).send({
      success: true,
      message: "All vendors",
      totalVendors: data.length,
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All vendors",
      error: error.message,
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

    const isMatch = await bcrypt.compare(password, vendor?.password);

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
    const decodedvendor = req?.decodedvendor?.id;
    const result = await db.query(`SELECT * FROM vendors WHERE id=?`, [
      decodedvendor,
    ]);

    const vendor = result[0];
    res.status(200).json(vendor[0]);
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
    const [data] = await db.query(`SELECT * FROM vendors WHERE id=?`, [
      vendorID,
    ]);
    if (!data || data.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No vendor found",
        data,
      });
    }
    res.status(200).send({
      success: true,
      message: "Get vendor successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting vendor",
      error,
    });
  }
};

// create vendor
const createVendor = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(500).send({
        success: false,
        message: "name, email, password, phone is required in body",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const status = "Panding";

    // Check if email already exists
    const [checkEmail] = await db.query(`SELECT * FROM vendors WHERE email=?`, [
      email,
    ]);

    const checkVendor = checkEmail[0];

    if (checkVendor == undefined) {
      const data = await db.query(
        `INSERT INTO vendors (name, email, password, phone, status ) VALUES ( ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, phone, status]
      );
      if (!data) {
        return res.status(404).send({
          success: false,
          message: "Error in INSERT QUERY",
        });
      }

      const [vendorInfo] = await db.query(
        `SELECT * FROM vendors WHERE email=?`,
        [email]
      );
      const vendorResult = vendorInfo[0];
      const token = generateVendorToken(vendorResult);
      const { password: pwd, ...vendorWithoutPassword } = vendorResult;

      res.status(200).send({
        success: true,
        message: "Vendor Register Successfully",
        data: {
          vendor: vendorWithoutPassword,
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
      message: "Error in Create vendor API",
      error: error.message,
    });
  }
};

// update vendor
const updateVendor = async (req, res) => {
  try {
    const vendorID = req?.decodedvendor?.id;

    const { name, phone, emergencyPhone, about, companyName, businessLisence } =
      req.body;

    // Check for required fields
    if (
      !name ||
      !phone ||
      !emergencyPhone ||
      !about ||
      !companyName ||
      !businessLisence
    ) {
      return res.status(500).send({
        success: false,
        message:
          "name, phone, emergencyPhone, about, companyName, businessLisence is required in body",
      });
    }

    const images = req.file;

    const [vendorProfile] = await db.query(`SELECT * FROM vendors WHERE id=?`, [
      vendorID,
    ]);

    let proPic = vendorProfile[0]?.profilePicture;
    if (images && images.path) {
      proPic = `/public/images/${images.filename}`;
    }

    const data = await db.query(
      `UPDATE vendors SET name=?, phone=?, emergencyPhone=?, about=?, companyName=?, businessLisence=?, profilePicture=? WHERE id=?`,
      [
        name,
        phone,
        emergencyPhone,
        about,
        companyName,
        businessLisence,
        proPic,
        vendorID,
      ]
    );

    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in updating vendor",
      });
    }

    res.status(200).send({
      success: true,
      message: "Vendor updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating vendor",
      error: error.message,
    });
  }
};

// nidUpload
const nidUpload = async (req, res) => {
  try {
    const vendorID = req?.decodedvendor?.id;

    const [nidCardCheck] = await db.query(`SELECT * FROM vendors WHERE id=?`, [
      vendorID,
    ]);

    const nidCardFrontCheck = nidCardCheck[0].nidCardFront;

    if (nidCardFrontCheck) {
      return res.status(500).send({
        success: false,
        message: "You have already submited",
      });
    }

    const nidCardFront = `/public/images/${req.files["nidCardFront"][0].filename}`;
    const nidCardBack = `/public/images/${req.files["nidCardBack"][0].filename}`;

    const [data] = await db.query(
      `UPDATE vendors SET nidCardFront=?, nidCardBack=? WHERE id=?`,
      [nidCardFront, nidCardBack, vendorID]
    );

    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in uploading nid card",
      });
    }

    res.status(200).send({
      success: true,
      message: "nid card updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in uploading nid card",
      error: error.message,
    });
  }
};

// update vendorID password
const updateVendorPassword = async (req, res) => {
  try {
    const vendorID = req?.decodedvendor?.id;

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(500).json({
        success: false,
        error: "old_password, new_password required in body",
      });
    }

    const [data] = await db.query("SELECT password FROM vendors WHERE id =?", [
      vendorID,
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

    const [result] = await db.query(
      `UPDATE vendors SET password=? WHERE id =?`,
      [hashedPassword, vendorID]
    );

    if (!result) {
      return res.status(403).json({
        success: false,
        error: "Something went wrong",
      });
    }

    res.status(200).send({
      success: true,
      message: "vendors password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in password Update vendors ",
      error: error.message,
    });
  }
};

// status update
const statusUpdate = async (req, res) => {
  try {
    const vendorID = req.params.id;
    if (!vendorID) {
      return res.status(404).send({
        success: false,
        message: "vendorID is required in params",
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
    const data = await db.query(`UPDATE vendors SET status=? WHERE id=?`, [
      status,
      vendorID,
    ]);

    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in status updating vendor",
      });
    }

    res.status(200).send({
      success: true,
      message: "Vendor status updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in status updating vendor",
      error: error.message,
    });
  }
};

// delete vendor
const deleteVendor = async (req, res) => {
  try {
    const vendorID = req.params.id;
    if (!vendorID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide vendor  id",
      });
    }

    const [data] = await db.query(`SELECT * FROM vendors WHERE id=?`, [
      vendorID,
    ]);
    if (!data || data.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No vendor found",
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
      error: error.message,
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
  nidUpload,
  updateVendorPassword,
  statusUpdate,
  deleteVendor,
};
