const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.log(error));

app.use("/api/products", productRoutes);

app.listen(3006, () => {
  console.log("Port 3006");
});
