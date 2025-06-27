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
  const [showClosedOnes, setShowClosedOnes] = useState(false)
  const history = useHistory();

  const fetchBills = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/bills.json");
      let newData = objectToArrayWithId(res.data)
      if (showClosedOnes == false) {
        newData = newData.filter(
          (bill) => parseInt(bill.status) > 0
        );
        setBills(newData);
      }
      sortStatus(newData)
      setBills(newData);

    } catch (ex) {
      setError(ex.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills();
  }, [showClosedOnes]);

  const sortStatus = (newData) => {
    const statusOrder = { 1: 0, 2: 1, 3: 2, 0: 3 };

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    newData.sort((a, b) => {
      const aStatus = parseInt(a.status);
      const bStatus = parseInt(b.status);

      const aOrder = statusOrder[aStatus];
      const bOrder = statusOrder[bStatus];

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      if (aStatus === 0) {
        const aDate = parseDate(a.date);
        const bDate = parseDate(b.date);
        return bDate - aDate;
      }

      // pozostałe statusy: nie sortujemy dalej
      return 0;
    });
  }

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
      if (item.status === "0" || item.status === "3") {
        notifications++
      }
    })

    if (notifications) { return notifications } else { return "" };
  };

  return <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">Wyświetl archiwalne rachunki</span>
        <div class="input-group-text">
          <input type="checkbox" checked={showClosedOnes} onChange={(e) => setShowClosedOnes(e.target.checked)}></input>
        </div>
      </div>
    </div>
    {loading ? (
      <LoadingIcon />
    ) : (
      <div style={{ fontSize: "0.8rem" }}>
        {bills.length ? (
          <table className="table table-bordered">
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Status</th>
                {showClosedOnes && (<th>Data</th>)}
                <th>Imię</th>
                <th>Suma</th>
                <th>Opcje</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                    {bill.status === "3" && (
                      <span style={{ padding: "0.3rem" }} className="badge bg-info text-light">Zamykany</span>
                    )}
                    {bill.status === "2" && (
                      <span style={{ padding: "0.3rem" }} className="badge bg-warning text-light">
                        W akceptacji
                      </span>
                    )}
                    {parseInt(bill.status) === 1 && (
                      <span style={{ padding: "0.3rem" }} className="badge bg-success text-light">Otwarty</span>
                    )}{" "}
                    {bill.status === "0" && (
                      <span className="badge bg-secondary text-light">
                        Zamknięty
                      </span>
                    )}
                  </td>
                  {showClosedOnes && (<td
                    style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}
                  >
                    {bill.date}
                  </td>)}
                  <td
                    style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}
                  >
                    {bill.name}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                    {bill.items
                      ? objectToArrayWithId(bill.items).reduce(
                        (total, item) => { if (Number(item.status) !== 2) { return total + Number(item.price) * (item.quantity ?? 1) } else { return total } },
                        (bill.tip ? parseInt(bill.tip) : 0)
                      )
                      : 0}
                    zł
                  </td>
                  <td style={{ padding: "0.2rem", textAlign: "center", verticalAlign: "middle" }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={(event) => handleShowBill(bill.id)}
                    >
                      Pokaż{" "}
                      <span className="badge badge-light">
                        {calculateNotifications(bill)}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          (<div className="alert alert-warning w-100 text-center" role="alert">
            <h6>Nie znaleziono aktywnego rachunku</h6>
          </div>)
        )}
        {error && <span className="alert alert-danger">{error}</span>}
        {toastActive && (
          <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
        )}
      </div>
    )}
  </div>

}
