import axios from "../../../../axios";
import { useEffect, useState } from "react";
import { objectToArrayWithId } from "../../../../helpers/objects";
import useAuth from "../../../../hooks/useAuth";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";
import ModalNotification from "../../../../components/ModalNotification/ModalNotification";
import ActualTime from "../../../../components/ActualTime/ActualTime";
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

  const handleCloseBill = async (id) => {
    try {
      await axios.patch(`/bills/${id}.json?auth=${auth.token}`, {
        status: "0",
        endTime: ActualTime(),
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
                  {parseInt(bill.status) === 1 ? (
                    <span className="badge bg-success text-light">Otwarte</span>
                  ) : (
                    <span className="badge bg-warning text-light">
                      W akceptacji
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
                        (total, item) => total + Number(item.price),
                        0
                      )
                    : 0}
                  zł
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(event) => handleShowBill(bill.id)}
                  >
                    Pokaż
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
