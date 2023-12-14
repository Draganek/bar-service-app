import React, { useState, useEffect } from "react";
import axios from "../../../axios";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { objectToArrayWithId } from "../../../helpers/objects";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import useAuth from "../../../hooks/useAuth";
import ModalNotification from "../../../components/ModalNotificationButton/ModalNotificationButton";
import TokenNotification from "../../../components/TokenNotification/TokenNotification";

const BillDetails = () => {
  const { id } = useParams();
  const [auth] = useAuth();
  const [bill, setBill] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [tip, setTip] = useState(0);
  const [tokenInactive, setTokenInactive] = useState(false);

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
      setTokenInactive(true);
    }
    fetchBill();
  };

  const handleInputChange = (event) => {
    setTip(parseInt(event.target.value, 10).toString());
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
          <td style={{ padding: "0.2rem" }}>
            <button
              onClick={(e) => history.push(`/drinks/show/${product.drinkId}`)}
              className="btn btn-sm btn-primary"
            >
              Info
            </button>
            {product.status === "3" && (
              <ModalNotification
                small={true}
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

  const handleBill = async (status) => {
    const billChanges = { status: status };
    if (parseInt(tip) > 0) {
      billChanges.tip = tip;
    }
    try {
      await axios.patch(`/bills/${id}.json?auth=${auth.token}`, billChanges);
    } catch (ex) {
      setTokenInactive(true);
    }
    fetchBill();
  };

  useEffect(() => {
    fetchBill();
  }, []);

  return loading ? (
    <LoadingIcon />
  ) : (
    <div style={{ fontSize: "0.9rem" }}>
      <div className="card">
        <div
          className="card-header"
          style={{ paddingLeft: "0", paddingRight: "0" }}
        >
          <h5 className="mb-2 card-header">Rachunek za zamówienia</h5>
          <div className="card">
            <ul className="list-group">
              <li className="list-group-item">Data: {bill.date}r</li>
              <li className="list-group-item">Rozpoczęcie {bill.startTime ? bill.startTime : "-"}</li>
              {bill.endTime ? (
                <li className="list-group-item">Zakończenie: {bill.endTime}</li>
              ) : null}
              <li className="list-group-item">
                {" "}
                Status rachunku:{" "}
                {bill.status === "3" && (
                  <span className="badge bg-info text-light">Zamykany</span>
                )}
                {bill.status === "2" && (
                  <span className="badge bg-warning text-light">
                    W akceptacji
                  </span>
                )}
                {bill.status === "1" && (
                  <>
                    <span className="badge bg-success text-light mr-3">
                      Otwarty
                    </span>
                    {bill.items && (
                      <ModalNotification
                        onConfirm={(e) => handleBill("3")}
                        buttonColor="warning"
                        message={
                          <div>
                            Czy chcesz poprosić o zamknięcie rachunku? Nie
                            będziesz mógł dalej zamawiać.
                            <div className="input-group flex-nowrap mt-4">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="addon-wrapping"
                                >
                                  Jeżeli chcesz zostaw napiwek
                                </span>
                              </div>
                              <input
                                value={tip}
                                onChange={(e) => handleInputChange(e)}
                                type="number"
                                className="form-control"
                              />
                              <div className="input-group-append">
                                <span
                                  className="input-group-text"
                                  id="addon-wrapping"
                                >
                                  zł
                                </span>
                              </div>
                            </div>
                          </div>
                        }
                        small={true}
                        buttonText="Zamknij Rachunek"
                      />
                    )}
                  </>
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
        <div className="card-body" style={{ padding: "0" }}>
          <table className="table ">
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th scope="col">#</th>
                <th scope="col">Produkt</th>
                <th scope="col">Status</th>
                <th scope="col">Cena</th>
                <th scope="col">Opcje</th>
              </tr>
            </thead>
            <tbody style={{ padding: "0.2rem", textAlign: "center" }}>
              {renderBill()}
            </tbody>
          </table>
          {bill.tip && (
            <div className="ml-2" style={{ fontSize: "0.9rem" }}>
              <b>Napiwek: </b>
              {bill.tip}
              zł
            </div>
          )}

          {!bill.items && (
            <span
              style={{ fontSize: "0.8rem" }}
              className="alert alert-warning text-dark d-flex justify-content-center align-items-center w-100"
            >
              Brak zamówień
            </span>
          )}
        </div>
        <div className="card-footer">
          <div className="text-right" style={{ fontSize: "1rem" }}>
            <b>Suma: </b>
            {bill.items
              ? objectToArrayWithId(bill.items).reduce(
                  (total, item) => {
                    if (Number(item.status) < 2) {
                      return total + Number(item.price);
                    } else {
                      return total;
                    }
                  },
                  bill.tip ? parseInt(bill.tip) : 0
                )
              : 0}
            zł
          </div>
        </div>
      </div>
      <TokenNotification
        showNotification={tokenInactive}
        onClose={() => {
          setTokenInactive(false);
        }}
      />
    </div>
  );
};

export default BillDetails;
