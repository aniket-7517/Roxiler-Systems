const axios = require("axios");
const Product = require("../models/product");

const productController = {
  initializeDatabase: async (req, res) => {
    try {
      const response = await axios.get(
        "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
      );
      await Product.deleteMany({});
      await Product.insertMany(response.data);
      res.status(200).send({ message: "Database initialized successfully" });
    } catch (error) {
      res.status(500).send({ error: "Error initializing database" });
    }
  },

  getTransactionsByMonth: async (req, res) => {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month is required." });
    }

    const monthNumber = parseInt(month, 10);
    if (monthNumber < 1 || monthNumber > 12) {
      return res
        .status(400)
        .json({ error: "Invalid month. Must be between 01 and 12." });
    }

    try {
      const transactions = await Product.find({
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthNumber],
        },
      });

      if (transactions.length === 0) {
        return res
          .status(404)
          .json({ message: "No transactions found for this month." });
      }

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).send({ error: error.message });
    }
  },

  getStatistics: async (req, res) => {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month is required." });
    }

    try {
      let totalSaleAmount = 0;
      let totalSoldItems = 0;
      let totalUnsoldItems = 0;

      const products = await Product.find();

      products.forEach((product) => {
        const saleDate = new Date(product.dateOfSale);
        const productMonth = String(saleDate.getMonth() + 1).padStart(2, "0");

        if (productMonth === month) {
          if (product.sold) {
            totalSaleAmount += product.price;
            totalSoldItems++;
          } else {
            totalUnsoldItems++;
          }
        }
      });

      res.json({
        totalSaleAmount: Math.round(totalSaleAmount * 100) / 100,
        totalSoldItems,
        totalUnsoldItems,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPriceRangeData: async (req, res) => {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month is required." });
    }

    const monthNumber = parseInt(month, 10);
    if (monthNumber < 1 || monthNumber > 12) {
      return res
        .status(400)
        .json({ error: "Invalid month. Must be between 01 and 12." });
    }

    try {
      const priceRanges = [
        { _id: "0-100", min: 0, max: 100 },
        { _id: "101-200", min: 101, max: 200 },
        { _id: "201-300", min: 201, max: 300 },
        { _id: "301-400", min: 301, max: 400 },
        { _id: "401-500", min: 401, max: 500 },
        { _id: "501-600", min: 501, max: 600 },
        { _id: "601-700", min: 601, max: 700 },
        { _id: "701-800", min: 701, max: 800 },
        { _id: "801-900", min: 801, max: 900 },
        { _id: "901+", min: 901, max: Infinity },
      ];

      const results = await Promise.all(
        priceRanges.map(async (range) => {
          const count = await Product.countDocuments({
            price: { $gte: range.min, $lte: range.max },
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, monthNumber],
            },
          });
          return { _id: range._id, count };
        })
      );

      res.json(results);
    } catch (error) {
      console.error("Error fetching price range data:", error);
      res.status(500).send({ error: error.message });
    }
  },

  getCombinedData: async (req, res) => {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month is required." });
    }

    const start = new Date(`2023-${month}-01`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    try {
      const [transactions, statistics, priceRange, categoryDistribution] =
        await Promise.all([
          Product.find({ dateOfSale: { $gte: start, $lt: end } }),
          Product.aggregate([
            { $match: { sold: true, dateOfSale: { $gte: start, $lt: end } } },
            {
              $group: {
                _id: null,
                totalSaleAmount: { $sum: "$price" },
                totalSoldItems: {
                  $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] },
                },
                totalUnsoldItems: {
                  $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] },
                },
              },
            },
          ]),
          Product.aggregate([
            { $match: { sold: true, dateOfSale: { $gte: start, $lt: end } } },
            {
              $bucket: {
                groupBy: "$price",
                boundaries: [
                  0,
                  100,
                  200,
                  300,
                  400,
                  500,
                  600,
                  700,
                  800,
                  900,
                  Infinity,
                ],
                default: "901-above",
                output: { count: { $sum: 1 } },
              },
            },
          ]),
          Product.aggregate([
            { $match: { dateOfSale: { $gte: start, $lt: end } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
          ]),
        ]);

      res.json({ transactions, statistics, priceRange, categoryDistribution });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getCategoryCounts: async (req, res) => {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month is required." });
    }

    const monthNumber = parseInt(month, 10);
    if (monthNumber < 1 || monthNumber > 12) {
      return res
        .status(400)
        .json({ error: "Invalid month. Must be between 01 and 12." });
    }

    try {
      const results = await Product.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, monthNumber],
            },
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedResults = results.map((item) => ({
        category: item._id,
        count: item.count,
      }));

      res.json(formattedResults);
    } catch (error) {
      console.error("Error fetching category counts:", error);
      res.status(500).send({ error: error.message });
    }
  },
};

module.exports = productController;
