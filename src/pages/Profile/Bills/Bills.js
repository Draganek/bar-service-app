import axios from "../../../axios";
import { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { objectToArrayWithId } from "../../../helpers/objects";
import useAuth from "../../../hooks/useAuth";
import ActualDate from "../../../components/ActualDate/ActualDate";
import LoadingButton from "../../../UI/LoadingButton/LoadingButton";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import ActualTime from "../../../components/ActualTime/ActualTime"

export default function Bills() {
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const { url } = useRouteMatch();
  const [bills, setBills] = useState([]);

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
    setLoading(false)
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const addBillHandler = async () => {
    setLoading(true)
    await axios.post(`/bills.json?auth=${auth.token}`, {
      status: 1,
      date: ActualDate(),
      startTime: ActualTime(),
      price: 0,
      user_id: auth.userId,
    });
    fetchBills();
  };

  

  return (loading ? <LoadingIcon/> : (
    <div>
      {bills.length ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Status</th>
              <th>Data</th>
              <th>Produkty</th>
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
                <td>{bill.items ? (bill.items.length) : 0}</td>
                <td>
                  {bill.items ? (bill.items.reduce((total, item) => total + Number(item.price), 0)) : 0}zł
                </td>
                <td>
                  <Link
                    to={`/profil/bills/show/${bill.id}`}
                    className="btn btn-warning"
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
      {bills.some((bill) => bill.status == 1) ? (
        <a>Możesz mieć tylko jeden otwarty rachunek.</a>
      ) : (
        <LoadingButton loading={loading} className="btn btn-primary" onClick={addBillHandler}>
          Otwórz nowy rachunek
        </LoadingButton>
      )}
    </div>)
  );
}
