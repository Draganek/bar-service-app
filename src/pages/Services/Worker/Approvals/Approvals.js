import axios from "../../../../axios";
import { useEffect, useState } from "react";
import { objectToArrayWithId } from "../../../../helpers/objects";
import useAuth from "../../../../hooks/useAuth";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";
import ModalNotification from "../../../../components/ModalNotification/ModalNotification";
import ActualTime from "../../../../components/ActualTime/ActualTime";

export default function Approvals() {
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");

  const fetchBills = async () => {
    try {
      const res = await axios.get("/bills.json");
      const newData = objectToArrayWithId(res.data).filter(
        (bill) => bill.status === 1
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

  const handleCloseBill = async (id) => {
    try {
      await axios.patch(`/bills/${id}.json?auth=${auth.token}`, {
        status: "0",
        endTime: ActualTime(),
      });
    } catch (ex) {
      setError(ex.response.status);
    }
    fetchBills();
  };

  return loading ? (
    <LoadingIcon />
  ) : (
    <div>
      {bills.length ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Status</th>
              <th>Data</th>
              <th>Id użytkownika</th>
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
                    <span className="badge bg-secondary text-light">
                      Zamknięte
                    </span>
                  )}
                </td>
                <td>{bill.date}</td>
                <td
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    whiteSpace: "pre-line",
                  }}
                >
                  {bill.user_id}
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
                  <ModalNotification
                    onConfirm={(event) => handleCloseBill(bill.id)}
                    message="Czy na pewno chcesz zamknąć rachunek tego użytkownika?"
                    buttonText="Zamknij rachunek"
                    buttonColor="primary"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h6>Nie znaleziono żadnego rachunku do zatwierdzenia</h6>
      )}
      {error && <b className="text-danger">{error === 401 ? "Token użytkownika wygasł. Zaloguj się ponownie" : error}</b>}
    </div>
  );
}
