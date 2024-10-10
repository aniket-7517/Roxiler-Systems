import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

const App = () => {
  const [month, setMonth] = useState("03");
  const [search, setSearch] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchCategoryCounts();
  }, [month, search, pagination.page]);

  const fetchTransactions = async () => {
    try {
      const { page, perPage } = pagination;
      const response = await axios.get(
        `http://localhost:3006/api/products/transactions-by-month`,
        {
          params: { month, search, page, perPage },
        }
      );
      setTransactions(response.data);
      setPagination((prev) => ({ ...prev, total: response.data.length })); 
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/api/products/statistics`,
        { params: { month } }
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/api/products/price-range`,
        { params: { month } }
      );
      setBarChartData(response.data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const fetchCategoryCounts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/api/products/category-count`,
        { params: { month } }
      );
      setCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching category counts:", error);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPagination({ page: 1, perPage: 10, total: 0 });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleNextPage = () => {
    if (pagination.page * pagination.perPage < transactions.length) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const lowerSearch = search.toLowerCase();
    return (
      transaction.title.toLowerCase().includes(lowerSearch) ||
      transaction.description.toLowerCase().includes(lowerSearch) ||
      transaction.price.toString().includes(lowerSearch)
    );
  });

  return (
    <div className="twelve px-5 mt-5">
      <h5 className="text-center mb-5 display-6" style={{fontFamily:'initial', color:"darkslategray", textDecoration:"underline"}}>Transaction Dashboard</h5>

      <div className="row mb-4 border-top pt-4 align-items-end">
        <div className="col-md-4">
          <label htmlFor="monthSelect" className="form-label">
            <strong >Select Month</strong>
          </label>
          <select
            id="monthSelect"
            className="form-select"
            value={month}
            onChange={handleMonthChange}
          >
            {months.map((monthOption) => (
              <option key={monthOption.value} value={monthOption.value}>
                {monthOption.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-8">
          <label htmlFor="searchBox" className="form-label">
            <strong>Search Transactions</strong>
          </label>
          <input
            type="text"
            id="searchBox"
            className="form-control"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title, description, or price"
          />
        </div>
      </div>

      <div className="mb-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <TransactionsTable
              transactions={filteredTransactions}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              currentPage={pagination.page}
              total={filteredTransactions.length} 
              perPage={pagination.perPage}
            />
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body py-5">
              <h3 style={{fontFamily:"sans-serif"}} className="text-center mb-4">Statistics - {months.find(m => m.value === month)?.label || month}</h3>
              <Statistics statistics={statistics} />
            </div>
          </div>
        </div>
      </div>

      <div className="row my-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 style={{fontFamily:"sans-serif"}} className="text-center mb-3">Bar Chart Stats - {months.find(m => m.value === month)?.label || month}</h3>
              <BarChart data={barChartData} />
            </div>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 style={{fontFamily:"sans-serif"}} className="text-center mb-3">
                Category Distribution Pie Chart - {months.find(m => m.value === month)?.label || month}
              </h3>
              <PieChart data={categoryData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
