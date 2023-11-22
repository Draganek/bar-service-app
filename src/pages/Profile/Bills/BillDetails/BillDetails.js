import React, { useState, useEffect } from "react";
import axios from "../../../../axios";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const BillDetails = () => {
  const { id } = useParams();
  const [bill, setBill] = useState([]);

  const fetchBill = async () => {
    try {
      const res = await axios.get(`/bills/${id}.json`);
      const billData = res.data;
      setBill(billData);
    } catch (e) {
      alert(e);
    }
  };

  const renderBill = (props) => {
    if (bill.items) {
      return bill.items.map((product, id) => (
        <tr key={id}>
          <th scope="row">{id + 1}</th>
          <td>{product.name}</td>
          {product.status === "1" ? (
            <td className="text-success">
              <b>Wydany</b>
            </td>
          ) : (
            <td className="text-warning">
              <b>Oczekujący</b>
            </td>
          )}

          <td>{product.price}zł</td>
        </tr>
      ));
    }
  };

  useEffect(() => {
    fetchBill();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3 className="mb-2 card-header">Rachunek za zamówienia</h3>
          <div class="card">
            <ul class="list-group ">
              <li class="list-group-item">Data: {bill.date}r</li>
              <li class="list-group-item">Rozpoczęcie {bill.startTime}</li>
              {bill.endTime ? (
                <li class="list-group-item">Zakończenie: {bill.endTime}</li>
              ) : null}
              <li class="list-group-item">
                {" "}
                Status rachunku:{" "}
                {parseInt(bill.status) === 1 ? (
                  <span className="badge bg-success text-light">Otwarty</span>
                ) : (
                  <span className="badge bg-secondary text-light">
                    Zamknięty
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="card-body">
          <table className="table ">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Produkt</th>
                <th scope="col">Status</th>
                <th scope="col">Cena</th>
              </tr>
            </thead>
            <tbody>{renderBill()}</tbody>
          </table>
        </div>
        <div className="card-footer">
          <span style={{fontSize: "1.2rem"}}>
            <b>Suma:{" "}</b>
            {bill.items &&
              bill.items.reduce((total, item) => total + Number(item.price), 0)}
            zł
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
