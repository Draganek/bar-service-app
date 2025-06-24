import React, { useState, useEffect } from "react";
import axios from "../../../../../axios";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { objectToArrayWithId } from "../../../../../helpers/objects";
import LoadingIcon from "../../../../../UI/LoadingIcon/LoadingIcon";
import ModalNotification from "../../../../../components/ModalNotificationButton/ModalNotificationButton";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import useAuth from "../../../../../hooks/useAuth";
import ActualTime from "../../../../../components/ActualTime/ActualTime";
import ActualDate from "../../../../../components/ActualDate/ActualDate";
import TokenNotification from "../../../../../components/TokenNotification/TokenNotification";

const BillService = () => {
  const { id } = useParams();
  const [bill, setBill] = useState([]);
  const [auth] = useAuth();
  const [waitingDrinks, setWaitingDrinks] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenInactive, setTokenInactive] = useState(false);

  const stylePadding = { paddingLeft: "1rem", paddingRight: "0" }

  const fetchBill = async () => {
    try {
      const res = await axios.get(`/bills/${id}.json`);
      const billData = res.data;
      setBill(billData);
      setWaitingDrinks(objectToArrayWithId(billData.items));
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  };

  const handleDrinkStatus = async (drinkId, status) => {
    setLoading(true);
    try {
      await axios.patch(
        `/bills/${id}/items/${drinkId}.json?auth=${auth.token}`,
        {
          status: status,
        }
      );
    } catch (ex) {
      if (ex.response.status === 401) {
        setTokenInactive(true)
      } else {
        setError(ex.message);
      }
    }
    fetchBill();
  };

  const closeBill = async () => {
    try {
      await axios.patch(`/bills/${id}.json?auth=${auth.token}`, {
        endTime: ActualTime(),
        status: "0",
      });
    } catch (ex) {
      if (ex.response.status === 401) {
        setTokenInactive(true)
      } else {
        setError(ex.message);
      }
    }
    fetchBill();
  }

  const handleBill = async (status) => {
    try {
      await axios.patch(`/bills/${id}.json?auth=${auth.token}`, {
        status: status,
        date: ActualDate(),
        startTime: ActualTime(),
      });
    } catch (ex) {
      if (ex.response.status === 401) {
        setTokenInactive(true)
      } else {
        setError(ex.message);
      }
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
      <div className="card col-12 col-md-9 col-lg-7 p-0" style={{ margin: 'auto' }}>
        <h4 className="card-header">Rachunek za zamówienia</h4>
        <div className="card">
          <ul className="list-group">
            <li className="list-group-item" style={stylePadding}>
              <b>Imię użytkownika:</b> {bill.name}
            </li>
            <li className="list-group-item" style={stylePadding}>
              <b>Id:</b> {bill.user_id}r
            </li>
            <li className="list-group-item" style={stylePadding}>
              <b>Data:</b> {bill.date}r
            </li>
            <li className="list-group-item" style={stylePadding}>
              <b>Rozpoczęcie:</b> {bill.startTime}
            </li>
            {bill.endTime ? (
              <li className="list-group-item" style={stylePadding}>
                <b>Zakończenie:</b> {bill.endTime}
              </li>
            ) : null}
            <li className="list-group-item" style={stylePadding}>
              {" "}
              <b>Status rachunku:</b>{" "}
              {bill.status === "2" && (
                <>
                  <span className="badge bg-warning text-light mr-2">
                    W akceptacji
                  </span>
                  <ModalNotification
                    onConfirm={e => handleBill("1")}
                    buttonColor="primary"
                    message={`Czy chcesz otworzyć rachunek użytkownika "${bill.name}"?`}
                    small={true}
                    buttonText="Otwórz rachunek" />
                </>
              )}
              {(bill.status === '1' || bill.status === '3') && (
                <>
                  {bill.status === "3" && (
                    <span className="badge bg-info text-light mr-3">
                      Zamykany
                    </span>
                  )}
                  {bill.status === "1" && (
                    <span className="badge bg-success text-light mr-3">
                      Otwarty
                    </span>
                  )}
                  <ModalNotification
                    onConfirm={e => closeBill()}
                    buttonColor="warning"
                    message={`Czy chcesz zamknąć rachunek użytkownika "${bill.name}"?`}
                    small={true}
                    buttonText="Zamknij rachunek" />
                </>
              )}
              {bill.status === "0" && (
                <span className="badge bg-secondary text-light">Zamknięty</span>
              )}
            </li>
          </ul>
        </div>




        {waitingDrinks && waitingDrinks.length > 0 ? (
          <div>
            <table
              className="table table-bordered"
              style={{ fontSize: "0.8rem" }}
            >
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>Status</th>
                  <th>Drink</th>
                  <th>Ilość</th>
                  <th>Cena</th>
                  <th>Opcje</th>
                </tr>
              </thead>
              <tbody>
                {waitingDrinks.map((order) => (
                  <tr key={order.id}>
                    <td style={{ padding: "0.1rem", textAlign: "center", verticalAlign: "middle" }}>
                      {parseInt(order.status) === 0 && (
                        <span className="badge bg-primary text-light">
                          Zaakceptowany
                        </span>
                      )}
                      {parseInt(order.status) === 1 && (
                        <span className="badge bg-success text-light">
                          Wydany
                        </span>
                      )}
                      {parseInt(order.status) === 2 && (
                        <span className="badge bg-danger text-light">
                          Anulowany
                        </span>
                      )}
                      {parseInt(order.status) === 3 && (
                        <span className="badge bg-warning text-light">
                          W akceptacji
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.1rem", textAlign: "center", verticalAlign: "middle" }}>
                      {order.name}
                    </td>
                    <td style={{ padding: "0", textAlign: "center", verticalAlign: "middle" }}>{order.quantity}szt.</td>
                    <td style={{ padding: "0", textAlign: "center", verticalAlign: "middle" }}>{order.price}zł</td>
                    <td style={{ padding: "0.1rem", textAlign: "center" }}>

                      {order.status === "3" && (
                        <ModalNotification
                          disabled={order.status === "1"}
                          onConfirm={(event) =>
                            handleDrinkStatus(order.id, "0")
                          }
                          message={`Czy na pewno chcesz zmienić status drinka ${order.name} na zaakceptowany?`}
                          buttonText="Akceptuj"
                          buttonColor="success"
                          small={true}
                        />
                      )}

                      {order.status === "0" && (
                        <ModalNotification
                          disabled={order.status === "1"}
                          onConfirm={(event) =>
                            handleDrinkStatus(order.id, "1")
                          }
                          message="Czy na pewno chcesz potwierdzić wydanie drinka dla tego użytkownika?"
                          buttonText="Wydaj"
                          buttonColor="success"
                          small={true}
                        />
                      )}

                      {order.status === "0" && (
                        <ModalNotification
                          disabled={order.status === "1"}
                          onConfirm={(event) =>
                            handleDrinkStatus(order.id, "2")
                          }
                          message="Czy na pewno chcesz anulować to zamówienie?"
                          buttonText="Anuluj"
                          buttonColor="danger"
                          small={true}
                        />
                      )}

                      <Link
                        to={`/drinks/show/${order.drinkId}`}
                        className="btn btn-sm btn-primary"
                      >
                        Info
                      </Link>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bill.tip && (<div className="ml-2 mb-3" style={{ fontSize: "0.8rem" }}>
              <b>Napiwek: </b>
              {bill.tip}
              zł
            </div>)}</div>
        ) : (
          <h6 className="m-3 text-center">Nie znaleziono żadnego zamówienia</h6>
        )}
        <div className="card-footer">
          <div className="text-right mr-3" style={{ fontSize: "1rem" }}>
            <b>Suma: </b>
            {bill.items
              ? objectToArrayWithId(bill.items).reduce(
                (total, item) => {
                  if (Number(item.status) !== 2) {
                    return total + Number(item.price) * (item.quantity ?? 1);
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
        onClose={() => { setTokenInactive(false) }}
      />
    </div>
  );
};

export default BillService;
