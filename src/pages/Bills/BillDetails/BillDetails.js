import React, { useState, useEffect } from "react";
import axios from "../../../axios";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { objectToArrayWithId } from "../../../helpers/objects";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import useAuth from "../../../hooks/useAuth";
import ModalNotification from "../../../components/ModalNotification/ModalNotification";

const BillDetails = () => {
  const { id } = useParams();
  const [auth] = useAuth();
  const [bill, setBill] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const fetchBill = async () => {
    try {
      const res = await axios.get(`/bills/${id}.json`);
      const billData = res.data;
      setBill(billData);
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  };

  const handleDeleteOrder = async (drinkId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/bills/${id}.json`);
      
      const check = objectToArrayWithId(res.data.items).filter(
        (drink) => drink.id === drinkId && drink.status === "3"
      );
      if (check.length > 0) {
        await axios.delete(
          `/bills/${id}/items/${drinkId}.json?auth=${auth.token}`
        );
      } else {
        alert("Zamówienie zostało już zaakceptowane");
      }
    } catch (ex) {
      alert(ex);
    }
    fetchBill();
  };

  const renderBill = (props) => {
    if (bill.items) {
      return objectToArrayWithId(bill.items).map((product, id) => (
        <tr style={{ fontSize: "0.8rem" }} key={id}>
          <th scope="row">{id + 1}</th>
          <td>{product.name}</td>
          {parseInt(product.status) === 0 && (
            <td className="text-primary">
              <b>Akceptowany</b>
            </td>
          )}
          {parseInt(product.status) === 1 && (
            <td className="text-success">
              <b>Wydany</b>
            </td>
          )}
          {parseInt(product.status) === 2 && (
            <td className="text-danger">
              <b>Anulowany</b>
            </td>
          )}
          {parseInt(product.status) === 3 && (
            <td className="text-warning">
              <b>W akceptacji</b>
            </td>
          )}

          <td>{product.price}zł</td>
          <td>
            <button
              onClick={(e) => history.push(`/drinks/show/${product.drinkId}`)}
              className="btn btn-sm btn-primary"
            >
              Info
            </button>
            {product.status === "3" && (
              <ModalNotification
                buttonText="Usuń"
                message={`Czy na pewno chcesz anulować zamówienie ${product.name}`}
                onConfirm={(e) => {
                  handleDeleteOrder(product.id);
                }}
              />
            )}
          </td>
        </tr>
      ));
    }
  };

  useEffect(() => {
    fetchBill();
  }, []);

  return loading ? (
    <LoadingIcon />
  ) : (
    <div style={{ fontSize: "0.8rem" }}>
      <div className="card">
        <div className="card-header">
          <h5 className="mb-2 card-header">Rachunek za zamówienia</h5>
          <div className="card">
            <ul className="list-group ">
              <li className="list-group-item">Data: {bill.date}r</li>
              <li className="list-group-item">Rozpoczęcie {bill.startTime}</li>
              {bill.endTime ? (
                <li className="list-group-item">Zakończenie: {bill.endTime}</li>
              ) : null}
              <li className="list-group-item">
                {" "}
                Status rachunku:{" "}
                {bill.status === "2" && (
                  <span className="badge bg-warning text-light">
                    W akceptacji
                  </span>
                )}
                {bill.status === "1" && (
                  <span className="badge bg-success text-light">Otwarty</span>
                )}{" "}
                {bill.status === "0" && (
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
                <th scope="col">Opcje</th>
              </tr>
            </thead>
            <tbody>{renderBill()}</tbody>
          </table>
          {!bill.items && <p>Brak zamówień</p>}
        </div>
        <div className="card-footer">
          <span style={{ fontSize: "1rem" }}>
            <b>Suma: </b>
            {bill.items
              ? objectToArrayWithId(bill.items).reduce(
                  (total, item) => total + Number(item.price),
                  0
                )
              : 0}
            zł
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
