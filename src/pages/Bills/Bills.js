import axios from "../../axios";
import { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { objectToArrayWithId } from "../../helpers/objects";
import useAuth from "../../hooks/useAuth";
import ActualDate from "../../components/ActualDate/ActualDate";
import LoadingButton from "../../UI/LoadingButton/LoadingButton";
import LoadingIcon from "../../UI/LoadingIcon/LoadingIcon";
import ActualTime from "../../components/ActualTime/ActualTime";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function Bills() {
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [toastActive, setToastActive] = useState(false);

  const fetchBills = async () => {
    try {
      const res = await axios.get("/bills.json");
      const newData = objectToArrayWithId(res.data).filter(
        (bill) => bill.user_id === auth.userId
      );
      newData.sort((a, b) => b.status - a.status);
      setBills(newData);
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const addBillHandler = async () => {
    setLoading(true);
    try {
      await axios.post(`/bills.json?auth=${auth.token}`, {
        status: "2",
        name: auth.name,
        date: ActualDate(),
        startTime: ActualTime(),
        price: 0,
        user_id: auth.userId,
      });
      fetchBills();
    } catch (ex) {
      if (ex.response.status === 401) {
        handleToggleToast();
      } else {
        setError(ex.message);
      }
      setLoading(false);
    }
  };

  const handleToggleToast = () => {
    setToastActive(!toastActive);
  };

  return loading ? (
    <LoadingIcon />
  ) : (
    <>
      <h3 className="card-header">Moje rachunki</h3>
      {
        <div>
          {bills.length ? (
            <table className="table table-bordered">
              <thead>
                <tr style={{ fontSize: "0.8rem" }}>
                  <th>Status</th>
                  <th>Data</th>
                  <th>ilość</th>
                  <th>Suma</th>
                  <th>Opcje</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} style={{ fontSize: "0.8rem" }}>
                    <td>
                      {bill.status === "3" && (
                        <span className="badge bg-info text-light">
                          Zamykany
                        </span>
                      )}
                      {(bill.status) === "2" && (
                        <span className="badge bg-warning text-light">
                          W akceptacji
                        </span>
                      )}
                      {parseInt(bill.status) === 1 && (
                        <span className="badge bg-success text-light">
                          Otwarte
                        </span>
                      )}  {(bill.status) === "0" && (
                        <span className="badge bg-secondary text-light">
                          Zamknięte
                        </span>
                      )}
                    </td>
                    <td>{bill.date}</td>
                    <td>
                      {bill.items ? objectToArrayWithId(bill.items).length : 0}
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
                      <Link
                        to={`/bills/${bill.id}`}
                        className="btn btn-sm btn-warning"
                      >
                        Pokaż
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h6>Nie znaleziono żadnego rachunku</h6>
          )}
          {bills.some((bill) => parseInt(bill.status) > 0) ? (
            <span
              style={{ fontSize: "0.8rem" }}
              className="alert alert-warning"
            >
              Możesz mieć tylko jeden otwarty rachunek.
            </span>
          ) : (
            <LoadingButton
              loading={loading}
              className="btn btn-primary"
              onClick={addBillHandler}
            >
              Otwórz nowy rachunek
            </LoadingButton>
          )}
          {error && <span className="alert alert-danger">{error}</span>}
          {toastActive && (
            <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
          )}
        </div>
      }
    </>
  );
}
