import React from "react";

const TransactionsTable = ({
  transactions,
  onNextPage,
  onPrevPage,
  currentPage,
  total,
  perPage,
}) => {
  return (
    <div className="container mt-4">
      <table className="table table-hover table-bordered border-success">
        <thead className="table-success">
          <tr className="text-center">
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th className="col-sm-1">Date of Sale</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="p-4">{transaction.id}</td>
              <td className="p-4">{transaction.title}</td>
              <td className="p-4">{transaction.description}</td>
              <td className="p-4">${transaction.price.toFixed(2)}</td>
              <td className="p-4">
                {new Date(transaction.dateOfSale).toLocaleDateString()}
              </td>
              <td className="p-4">{transaction.sold ? "Yes" : "No"}</td>
              <td className="p-4">
                <img height="90px" width="90px" src={transaction.image} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="btn btn-primary"
              onClick={onPrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <span className="btn btn-warning mx-2">Page {currentPage}</span>
          </li>
          <li
            className={`page-item ${
              currentPage * perPage >= total ? "disabled" : ""
            }`}
          >
            <button
              className="btn btn-primary"
              onClick={onNextPage}
              disabled={currentPage * perPage >= total}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TransactionsTable;
