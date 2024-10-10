const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/initialize", productController.initializeDatabase);

router.get("/transactions-by-month", productController.getTransactionsByMonth);

router.get("/statistics", productController.getStatistics);

router.get("/price-range", productController.getPriceRangeData);

router.get("/combined", productController.getCombinedData);

router.get("/category-count", productController.getCategoryCounts);

module.exports = router;
