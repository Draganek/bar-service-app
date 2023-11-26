import axios from "../../../../axios";
import { useEffect, useState } from "react";
import { objectToArrayWithId } from "../../../../helpers/objects";
import useAuth from "../../../../hooks/useAuth";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";
import ModalNotification from "../../../../components/ModalNotification/ModalNotification";
import ToastMessage from "../../../../components/ToastMessage/ToastMessage";

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
      } catch {}
    } catch (ex) {
      setError(ex.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleCloseDrink = async (billId, drinkId) => {
    setLoading(true);

    try {
      await axios.patch(`/bills/${billId}/items/${drinkId}.json?auth=${auth.token}`, {
        status: "1",
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
      {waitingDrinks ? (
        <table className="table table-bordered">
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
                  {parseInt(order.status) === 1 ? (
                    <span className="badge bg-success text-light">Wydany</span>
                  ) : (
                    <span className="badge bg-warning text-light">
                      Oczekuje
                    </span>
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
                  <ModalNotification
                    disabled={order.status === '1'}
                    onConfirm={(event) =>
                      handleCloseDrink(order.billId, order.id)
                    }
                    message="Czy na pewno chcesz potwierdzić wydanie drinka dla tego użytkownika?"
                    buttonText="Wydaj"
                    buttonColor="success"
                  />
                  <button className="btn btn-primary ml-1">Info</button>
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
