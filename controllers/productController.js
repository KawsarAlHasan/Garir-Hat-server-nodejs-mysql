const db = require("../config/db");

const getCheck = async (req, res) => {
  try {
    let query = `SELECT products.*, vendors.id AS supplier FROM products JOIN supplier ON products.supplier = vendors.id `;

    const rows = await db.query(query);

    res.send(rows);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let {
      name,
      category,
      subcategory,
      city,
      area,
      condition,
      brand,
      model,
      yearOfManufacture,
      kmRun,
      engineCapacity,
      bodyType,
      transmission,
      status,
      supplier,
      numOfSeats,
      color,
      numOfDoors,
      vehicleHistory,
      fuelType,
      cabinSize,
      make,
      bodyStyle,
      drivetrain,
      vehicleFutureList,
      sort,
      page,
      limit,
    } = req.query;

    // Default values
    sort = sort || "id";
    category = category || "";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    if (!name) {
      name = name || "";
    }

    // Construct the main query
    let query = "SELECT * FROM products WHERE (name LIKE ? )";
    let params = [`%${name}%`];

    // Add category condition if provided
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (subcategory) {
      query += " AND subcategory = ?";
      params.push(subcategory);
    }
    if (city) {
      query += " AND city = ?";
      params.push(city);
    }
    if (area) {
      query += " AND area = ?";
      params.push(area);
    }
    if (condition) {
      query += " AND condition = ?";
      params.push(condition);
    }
    if (brand) {
      query += " AND brand = ?";
      params.push(brand);
    }
    if (model) {
      query += " AND model = ?";
      params.push(model);
    }
    if (yearOfManufacture) {
      query += " AND yearOfManufacture = ?";
      params.push(yearOfManufacture);
    }
    if (kmRun) {
      query += " AND kmRun = ?";
      params.push(kmRun);
    }
    if (engineCapacity) {
      query += " AND engineCapacity = ?";
      params.push(engineCapacity);
    }
    if (bodyType) {
      query += " AND bodyType = ?";
      params.push(bodyType);
    }
    if (transmission) {
      query += " AND transmission = ?";
      params.push(transmission);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    if (supplier) {
      query += " AND supplier = ?";
      params.push(supplier);
    }
    if (numOfSeats) {
      query += " AND numOfSeats = ?";
      params.push(numOfSeats);
    }
    if (color) {
      query += " AND color = ?";
      params.push(color);
    }
    if (numOfDoors) {
      query += " AND numOfDoors = ?";
      params.push(numOfDoors);
    }
    if (vehicleHistory) {
      query += " AND vehicleHistory = ?";
      params.push(vehicleHistory);
    }
    if (fuelType) {
      query += " AND fuelType = ?";
      params.push(fuelType);
    }
    if (cabinSize) {
      query += " AND cabinSize = ?";
      params.push(cabinSize);
    }
    if (make) {
      query += " AND make = ?";
      params.push(make);
    }
    if (bodyStyle) {
      query += " AND bodyStyle = ?";
      params.push(bodyStyle);
    }
    if (drivetrain) {
      query += " AND drivetrain = ?";
      params.push(drivetrain);
    }
    if (vehicleFutureList) {
      query += " AND vehicleFutureList = ?";
      params.push(vehicleFutureList);
    }

    // Add sort condition
    query += ` ORDER BY ${sort}`;

    // Add pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute the main query
    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No products found",
      });
    }

    // Construct the total count query
    let totalQuery =
      "SELECT COUNT(*) as count FROM products WHERE (name LIKE ?)";
    let totalParams = [`%${name}%`];

    if (category) {
      totalQuery += " AND category = ?";
      totalParams.push(category);
    }
    if (subcategory) {
      totalQuery += " AND subcategory = ?";
      totalParams.push(subcategory);
    }
    if (city) {
      totalQuery += " AND city = ?";
      totalParams.push(city);
    }
    if (area) {
      totalQuery += " AND area = ?";
      totalParams.push(area);
    }
    if (condition) {
      totalQuery += " AND condition = ?";
      totalParams.push(condition);
    }
    if (brand) {
      totalQuery += " AND brand = ?";
      totalParams.push(brand);
    }
    if (model) {
      totalQuery += " AND model = ?";
      totalParams.push(model);
    }
    if (yearOfManufacture) {
      totalQuery += " AND yearOfManufacture = ?";
      totalParams.push(yearOfManufacture);
    }
    if (kmRun) {
      totalQuery += " AND kmRun = ?";
      totalParams.push(kmRun);
    }
    if (engineCapacity) {
      totalQuery += " AND engineCapacity = ?";
      totalParams.push(engineCapacity);
    }
    if (bodyType) {
      totalQuery += " AND bodyType = ?";
      totalParams.push(bodyType);
    }
    if (transmission) {
      totalQuery += " AND transmission = ?";
      totalParams.push(transmission);
    }
    if (status) {
      totalQuery += " AND status = ?";
      totalParams.push(status);
    }
    if (supplier) {
      totalQuery += " AND supplier = ?";
      totalParams.push(supplier);
    }
    if (numOfSeats) {
      totalQuery += " AND numOfSeats = ?";
      totalParams.push(numOfSeats);
    }
    if (color) {
      totalQuery += " AND color = ?";
      totalParams.push(color);
    }
    if (numOfDoors) {
      totalQuery += " AND numOfDoors = ?";
      totalParams.push(numOfDoors);
    }
    if (vehicleHistory) {
      totalQuery += " AND vehicleHistory = ?";
      totalParams.push(vehicleHistory);
    }
    if (fuelType) {
      totalQuery += " AND fuelType = ?";
      totalParams.push(fuelType);
    }
    if (cabinSize) {
      totalQuery += " AND cabinSize = ?";
      totalParams.push(cabinSize);
    }
    if (make) {
      totalQuery += " AND make = ?";
      totalParams.push(make);
    }
    if (bodyStyle) {
      totalQuery += " AND bodyStyle = ?";
      totalParams.push(bodyStyle);
    }
    if (drivetrain) {
      totalQuery += " AND drivetrain = ?";
      totalParams.push(drivetrain);
    }
    if (vehicleFutureList) {
      totalQuery += " AND vehicleFutureList = ?";
      totalParams.push(vehicleFutureList);
    }

    // Execute the total count query
    const [[{ count }]] = await db.query(totalQuery, totalParams);

    res.status(200).send({
      success: true,
      message: "All products",
      totalProducts: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All products",
      error: error.message,
    });
  }
};

// // get Product by id
const getProductByID = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide product id",
      });
    }
    const data = await db.query(`SELECT * FROM products WHERE id=?`, [
      productId,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No product  found",
      });
    }
    const product = data[0];
    res.status(200).send(product[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get product",
      error,
    });
  }
};

// create create Product
const createProducts = async (req, res, next) => {
  try {
    const {
      name,
      price,
      // quantity,
      // category,
      // subcategory,
      // city,
      // area,
      // condition,
      // brand,
      // model,
      // yearOfManufacture,
      // kmRun,
      // engineCapacity,
      // bodyType,
      // transmission,
      // description,
      // status,
      // supplier,
      // numOfSeats,
      // color,
      // numOfDoors,
      // vehicleHistory,
      // fuelType,
      // cabinSize,
      // make,
      // bodyStyle,
      // drivetrain,
      // vehicleFutureList,
    } = req.body;

    if (!name || !price) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const [data] = await db.query(
      `INSERT INTO products (
          name,
          price
        ) VALUES (?, ?)`,
      [
        name,
        price,
        // quantity,
        // category,
        // subcategory,
        // city,
        // area,
        // condition,
        // brand,
        // model,
        // yearOfManufacture,
        // kmRun,
        // engineCapacity,
        // bodyType,
        // transmission,
        // description,
        // status,
        // supplier,
        // numOfSeats,
        // color,
        // numOfDoors,
        // vehicleHistory,
        // fuelType,
        // cabinSize,
        // make,
        // bodyStyle,
        // drivetrain,
        // vehicleFutureList,
      ]
    );

    if (data.length == 0) {
      return res.status(404).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }

    const productId = data.insertId;

    const files = req.files;

    for (const file of files) {
      console.log(productId, file.path);
      console.log(files);
      // await connection.query(cl
      //   "INSERT INTO product_images (product_id, image_path) VALUES (?, ?)",
      //   [productId, file.path]
      // );
    }

    res.status(200).send({
      success: true,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create Products API",
      error: error.message,
    });
  }
};

// update updateImagesProducts
const updateImagesProducts = async (req, res) => {
  try {
    const productID = req.params.id;
    if (!productID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide product id",
      });
    }
    const images = req.files ? req.files.map((file) => file.path) : [];
    if (!images) {
      return res.status(500).send({
        success: false,
        message: "Please provide valid images",
      });
    }
    const data = await db.query(`UPDATE products SET images=? WHERE id =? `, [
      JSON.stringify(images),
      productID,
    ]);
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in images update product ",
      });
    }
    res.status(200).send({
      success: true,
      message: "product images updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in images Update product ",
      error,
    });
  }
};

// update product
const updateProducts = async (req, res) => {
  try {
    const productID = req.params.id;
    if (!productID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide product id",
      });
    }
    const { name, price } = req.body;
    const data = await db.query(
      `UPDATE products SET name=?, price=? WHERE id =? `,
      [name, price, productID]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in update product ",
      });
    }
    res.status(200).send({
      success: true,
      message: "product  updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Update product ",
      error,
    });
  }
};

// // delete Product
const deleteProducts = async (req, res) => {
  try {
    const productID = req.params.id;
    if (!productID) {
      return res.status(404).send({
        success: false,
        message: "Invalid id or provide product id",
      });
    }

    await db.query(`DELETE FROM products WHERE id=?`, [productID]);
    res.status(200).send({
      success: true,
      message: "product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete product",
      error,
    });
  }
};

module.exports = {
  getCheck,
  getAllProducts,
  getProductByID,
  createProducts,
  updateImagesProducts,
  updateProducts,
  deleteProducts,
};
