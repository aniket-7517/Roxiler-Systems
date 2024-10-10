import React from "react";

const Statistics = ({ statistics }) => {
  const style = {
    width: "445px",
    height: "70px",
    color: "white",
    backgroundImage:
      "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
    boxShadow:
      " rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "math",
    border:"1rem",
  };
  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card" style={style}>
          <div className="">
            <h5>Total Sale Amount</h5>
            <h5 className="card-text">${statistics.totalSaleAmount || 0}</h5>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card" style={style}>
          <div className="ms-2">
            <h5>Total Sold Items</h5>
            <h5 className="card-text">{statistics.totalSoldItems || 0}</h5>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card" style={style}>
          <div className="ms-2">
            <h5 style={{fontFamily:"sans-serif"}}>Total Unsold Items</h5>
            <h5 className="card-text">{statistics.totalUnsoldItems || 0}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
