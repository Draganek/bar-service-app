import axios from "../../axios";
import { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { objectToArrayWithId } from "../../helpers/objects";
import useAuth from "../../hooks/useAuth";
import ActualDate from "../../components/ActualDate/ActualDate";
import LoadingButton from "../../UI/LoadingButton/LoadingButton";
import LoadingIcon from "../../UI/LoadingIcon/LoadingIcon";
import TokenNotification from "../../components/TokenNotification/TokenNotification";

export default function Bills() {
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [tokenInactive, setTokenInactive] = useState(false);

  const fetchBills = async () => {
    try {
      const res = await axios.get("/bills.json");
      const newData = objectToArrayWithId(res.data).filter((bill) => bill.user_id === auth.userId);
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
        price: 0,
        user_id: auth.userId,
      });
      fetchBills();
    } catch (ex) {
      if (ex.response.status === 401) {
        setTokenInactive(true)
      } else {
        setError(ex.message);
      }
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingIcon />
  ) : (
    <>
      <h3 className="card-header">Moje rachunki</h3>
      {
        <div>
          {bills.length ? (
            <table className="table table-bordered" style={{ marginBottom: "0.3rem" }}>
              <thead>
                <tr style={{ fontSize: "0.8rem" }}>
                  <th>Status</th>
                  <th>Data</th>
                  <th>ilość</th>
                  <th>Suma</th>
                  <th>Opcje</th>
                </tr>
              </thead>
              <tbody >
                {bills.map((bill) => (
                  <tr key={bill.id} style={{ fontSize: "0.8rem" }}>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
                      {bill.status === "3" && (
                        <span style={{ padding: "0.3rem" }} className="badge bg-info text-light">
                          Zamykany
                        </span>
                      )}
                      {(bill.status) === "2" && (
                        <span style={{ padding: "0.3rem" }} className="badge bg-warning text-light">
                          W akceptacji
                        </span>
                      )}
                      {parseInt(bill.status) === 1 && (
                        <span style={{ padding: "0.3rem" }} className="badge bg-success text-light">
                          Otwarty
                        </span>
                      )}  {(bill.status) === "0" && (
                        <span style={{ padding: "0.3rem" }} className="badge bg-secondary text-light">
                          Zamknięty
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>{bill.date}</td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
                      {bill.items ? objectToArrayWithId(bill.items).length : 0}
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>
                      {bill.items
                        ? objectToArrayWithId(bill.items).reduce(
                          (total, item) => { if (Number(item.status) < 2) { return total + Number(item.price) } else { return total } },
                          (bill.tip ? parseInt(bill.tip) : 0)
                        )
                        : 0}
                      zł
                    </td>
                    <td style={{ padding: "0.2rem", textAlign: "center" }}>
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
            <div className="alert alert-warning w-100 text-center" role="alert">
              <h6>Nie znaleziono żadnego rachunku</h6>
            </div>
          )}
          {bills.some((bill) => parseInt(bill.status) > 0) ? (
            <span
              style={{ fontSize: "0.8rem", alignItems: "center" }}
              className="alert alert-warning d-flex justify-content-center"
            >
              Możesz mieć tylko jeden otwarty rachunek.
            </span>
          ) : (
            <LoadingButton
              loading={loading}
              className="btn btn-primary d-flex justify-content-center align-items-center mx-auto"
              onClick={addBillHandler}
            >
              Otwórz nowy rachunek
            </LoadingButton>
          )}
          {error && <span className="alert alert-danger">{error}</span>}
          <TokenNotification
            showNotification={tokenInactive}
            onClose={() => { setTokenInactive(false) }}
          />
        </div>
      }
    </>
  );
}
