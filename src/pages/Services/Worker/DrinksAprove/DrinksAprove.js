import axios from "../../../../axios";
import { useEffect, useState } from "react";
import { objectToArrayWithId } from "../../../../helpers/objects";
import useAuth from "../../../../hooks/useAuth";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";
import ModalNotification from "../../../../components/ModalNotification/ModalNotification";
import ToastMessage from "../../../../components/ToastMessage/ToastMessage";
import { Link } from "react-router-dom/cjs/react-router-dom";

export default function DrinksAprove() {
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [bills, setBills] = useState();
  const [waitingDrinks, setWaitingDrinks] = useState();
  const [error, setError] = useState("");
  const [toastActive, setToastActive] = useState(false);

  const fetchBills = async () => {
    try {
      const res = await axios.get("/bills.json");
      const newData = objectToArrayWithId(res.data).filter(
        (bill) => bill.status === 1
      );
      setBills(newData);
      try {
        const drinksWaiting = [];
        newData.map((item) => {
          objectToArrayWithId(item.items).map((drink) => {
            drink.billId = item.id;
            drink.client = item.name;

            drinksWaiting.push(drink);
          });
        });
        drinksWaiting.sort((b, a) => b.status - a.status);
        setWaitingDrinks(drinksWaiting);
      } catch { }
    } catch (ex) {
      setError(ex.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDrinkStatus = async (billId, drinkId, status) => {
    setLoading(true);

    try {
      await axios.patch(`/bills/${billId}/items/${drinkId}.json?auth=${auth.token}`, {
        status: status,
      });
    } catch (ex) {
      if (ex.response.status === 401) {
        handleToggleToast();
      } else {
        setError(ex.message);
      }
    }
    fetchBills();
  };

  const handleToggleToast = () => {
    setToastActive(!toastActive);
  };

  return loading ? (
    <LoadingIcon />
  ) : (
    <div>
      {waitingDrinks.length > 0 ? (
        <table className="table table-bordered" style={{fontSize: "0.8rem"}}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Imię</th>
              <th>Drink</th>
              <th>Opcje</th>
            </tr>
          </thead>
          <tbody>
            {waitingDrinks.map((order) => (
              <tr key={order.id}>
                <td>
                  {parseInt(order.status) === 0 && (
                    <span className="badge bg-warning text-light">Oczekuje</span>
                  )}
                  {parseInt(order.status) === 1 && (
                    <span className="badge bg-success text-light">Wydany</span>
                  )}
                  {parseInt(order.status) === 2 && (
                    <span className="badge bg-danger text-light">Anulowany</span>
                  )}

                </td>
                <td>{order.client}</td>
                <td
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    whiteSpace: "pre-line",
                  }}
                >
                  {order.name}
                </td>
                <td>
                  {order.status === '0' && (<ModalNotification
                    disabled={order.status === '1'}
                    onConfirm={(event) =>
                      handleDrinkStatus(order.billId, order.id, "1")
                    }
                    message="Czy na pewno chcesz potwierdzić wydanie drinka dla tego użytkownika?"
                    buttonText="Wydaj"
                    buttonColor="success"
                    small={true}
                  />)}

                  <Link to={`/drinks/show/${order.drinkId}`} className="btn btn-sm btn-primary">
                    Info
                  </Link>

                  {order.status === '0' && (<ModalNotification
                    disabled={order.status === '1'}
                    onConfirm={(event) =>
                      handleDrinkStatus(order.billId, order.id, "2")
                    }
                    message="Czy na pewno chcesz anulować to zamówienie?"
                    buttonText="Anuluj"
                    buttonColor="danger"
                    small={true}
                  />)}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h6>Nie znaleziono żadnego zamówienia</h6>
      )}
      {error && <span className="alert alert-danger">{error}</span>}
      {toastActive && (
        <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
      )}
    </div>
  );
}
