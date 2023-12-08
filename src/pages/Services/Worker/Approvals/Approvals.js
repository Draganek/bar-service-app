import axios from "../../../../axios";
import { useEffect, useState } from "react";
import { objectToArrayWithId } from "../../../../helpers/objects";
import useAuth from "../../../../hooks/useAuth";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";
import ToastMessage from "../../../../components/ToastMessage/ToastMessage";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Approvals() {
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [toastActive, setToastActive] = useState(false);
  const history = useHistory();

  const fetchBills = async () => {
    try {
      const res = await axios.get("/bills.json");
      const newData = objectToArrayWithId(res.data).filter(
        (bill) => parseInt(bill.status) > 0
      );
      newData.sort((a, b) => b.status - a.status);
      setBills(newData);
    } catch (ex) {
      setError(ex.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleToggleToast = () => {
    setToastActive(!toastActive);
  };

  const handleShowBill = (billId) => {
    history.push(`/services/bill/${billId}`);
  };

  const calculateNotifications = (bill) => {
    let notifications = 0;
    if (bill.status === "3") {
      notifications++;
    }
    objectToArrayWithId(bill.items).map(item => {
      if (item.status === "0" || item.status === "3"){
        notifications++
      }
    })

    if(notifications) {return notifications} else{return ""};
  };

  return loading ? (
    <LoadingIcon />
  ) : (
    <div style={{ fontSize: "0.8rem" }}>
      {bills.length ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Status</th>
              <th>Imię</th>
              <th>Suma</th>
              <th>Opcje</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>
                  {bill.status === "3" && (
                    <span className="badge bg-info text-light">Zamykany</span>
                  )}
                  {bill.status === "2" && (
                    <span className="badge bg-warning text-light">
                      W akceptacji
                    </span>
                  )}
                  {parseInt(bill.status) === 1 && (
                    <span className="badge bg-success text-light">Otwarte</span>
                  )}{" "}
                  {bill.status === "0" && (
                    <span className="badge bg-secondary text-light">
                      Zamknięte
                    </span>
                  )}
                </td>
                <td
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    whiteSpace: "pre-line",
                  }}
                >
                  {bill.name}
                </td>
                <td>
                  {bill.items
                    ? objectToArrayWithId(bill.items).reduce(
                        (total, item) => { if (Number(item.status) < 2) { return total + Number(item.price) } else { return total } },
                        (bill.tip ? parseInt(bill.tip) : 0)
                      )
                    : 0}
                  zł
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(event) => handleShowBill(bill.id)}
                  >
                    Pokaż{" "}
                    <span class="badge badge-light">
                      {calculateNotifications(bill)}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h6>Nie znaleziono żadnego rachunku do zatwierdzenia</h6>
      )}
      {error && <span className="alert alert-danger">{error}</span>}
      {toastActive && (
        <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
      )}
    </div>
  );
}
