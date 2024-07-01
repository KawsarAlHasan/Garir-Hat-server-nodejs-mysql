const db = require("../config/db");

// get all Subcriptions
const getAllSubcriptions = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM subcriptions");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No Subcriptions found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All Subcriptions",
      totalSubcriptions: data[0].length,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Subcriptions",
      error,
    });
  }
};

// get Subcription by id
const getSubcriptionByID = async (req, res) => {
  try {
    const subcriptionId = req.params.id;
    if (!subcriptionId) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide Subcription id",
      });
    }
    const data = await db.query(`SELECT * FROM subcriptions WHERE id=?`, [
      subcriptionId,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No subcription  found",
      });
    }
    res.status(200).send({
      success: true,
      data: data[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get subcription",
      error,
    });
  }
};

// create createSubcription
const createSubcription = async (req, res, next) => {
  try {
    const { name, type, price } = req.body;

    if (!name || !type || !price) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const data = await db.query(
      `INSERT INTO subcriptions (name, type, price ) VALUES ( ?, ?, ?)`,
      [name, type, price]
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    res.status(200).send({
      success: true,
      message: "subcriptions create Successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create subcriptions API",
      error,
    });
  }
};

// // update subcription
const updateSubcription = async (req, res) => {
  try {
    const subcriptionID = req.params.id;
    if (!subcriptionID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide subcription id",
      });
    }
    const { name, type, price } = req.body;
    const data = await db.query(
      `UPDATE subcriptions SET name=?, type=?, price=? WHERE id =? `,
      [name, type, price, subcriptionID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update subcription ",
      });
    }
    res.status(200).send({
      success: true,
      message: "subcription  updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update subcription ",
      error,
    });
  }
};

// // delete Subcription
const deleteSubcription = async (req, res) => {
  try {
    const subcriptionID = req.params.id;
    if (!subcriptionID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide subcription  id",
      });
    }

    await db.query(`DELETE FROM subcriptions WHERE id=?`, [subcriptionID]);
    res.status(200).send({
      success: true,
      message: "subcription Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete subcription",
      error,
    });
  }
};

module.exports = {
  getAllSubcriptions,
  getSubcriptionByID,
  createSubcription,
  updateSubcription,
  deleteSubcription,
};
