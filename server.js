const express = require("express");
const dotenv = require("dotenv");
const mySqlPool = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const { autoUpdateTransaction } = require("./tasks/updateStatusTask");
const app = express();
const path = require("path");
dotenv.config();

const globalCorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(globalCorsOptions));
app.options("*", cors(globalCorsOptions));

// Alternatively, you can allow all origins by simply calling app.use(cors());
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

// routes
app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/vendor", require("./routes/vendorRoute"));
app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/subcription", require("./routes/subcriptionRoute"));
app.use("/api/v1/transaction", require("./routes/transactionRoute"));
app.use("/api/v1/product", require("./routes/productRoute"));

// port
const port = process.env.PORT || 5100;

// contidionaly listen
mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("MYSQL DB Connected");

    // listen
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Schedule the task when the application starts
autoUpdateTransaction();

app.get("/", (req, res) => {
  res.status(200).send("Garir Hat is working");
});
