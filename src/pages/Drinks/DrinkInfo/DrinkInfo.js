import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import ModalNotification from "../../../components/ModalNotification/ModalNotification";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import { objectToArrayWithId } from "../../../helpers/objects";
import ToastMessage from "../../../components/ToastMessage/ToastMessage";

export default function DrinkInfo(props) {
  const { id } = useParams();
  const [auth] = useAuth();
  const [activeBill, setActiveBill] = useState([]);
  const [cocktail, setCoctail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [toastActive, setToastActive] = useState(false);

  const fetchDrink = async () => {
    try {
      const res = await axios.get(`/cocktails/${id}.json`);
      setCoctail(res.data);
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
  };

  const fetchBill = async () => {
    try {
      const res = await axios.get(`/bills.json`);
      const bill = objectToArrayWithId(res.data).filter(
        (bill) => parseInt(bill.status) === 1 && bill.user_id === auth.userId
      );
      setActiveBill(bill[0]);
      
    } catch (ex) {
      
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrink();
    fetchBill();
  }, []);

  const handleAddToBill = async (props) => {
    if (activeBill) {
      setLoading(true);
      const items = { name: cocktail.name, price: cocktail.price, status: '3', drinkId: id, user: auth.userId }
      try {
        await axios.post(`/bills/${activeBill.id}/items.json?auth=${auth.token}`, items);
        setMessage("Pomyślnie dodano drinka do rachunku!");
      } catch (ex) {
        handleToggleToast();
      }

      fetchBill();
    } else {
      alert("Błąd: Nie masz aktywnego rachunku");
    }
  };

  const handleToggleToast = () => {
    setToastActive(!toastActive);
};

  return loading ? (
    <LoadingIcon />
  ) : (
    <div className="card">
      <img
        src={cocktail.image}
        className="card-img-top mx-auto border rounded"
        style={{ maxWidth: "20rem", objectFit: "cover" }}
        alt="..."
      />
      <div className="card-header">
        <h3 className="card-title text-center">{cocktail.name}</h3>
      </div>
      <div style={{fontSize: "0.9rem"}} className="card-body">
        <p className="card-text">
          <b>Opis: </b>
          {cocktail.description}
        </p>
      </div>

      <ul style={{fontSize: "0.9rem"}} className="list-group list-group-flush">
        {cocktail.alcohols && (
          <li className="list-group-item">
            <span className="card-text">
              <b>Alkohole: </b>
              {cocktail.alcohols.map((alcohol, index) => (
                <React.Fragment key={index}>
                  <a>{alcohol.name}{auth && auth.perm > 0 && ` ${alcohol.ml}ml`}</a>
                  {index !== cocktail.alcohols.length - 1 && <a>, </a>}
                </React.Fragment>
              ))}
              <br />
            </span>
          </li>
        )}
        {cocktail.fillers && (
          <li className="list-group-item">
            <span className="card-text">
              <b>Napoje: </b>
              {cocktail.fillers.map((filler, index) => (
                <React.Fragment key={index}>
                  <a>{filler.name}{auth && auth.perm > 0 && ` ${filler.ml}ml`}</a>
                  {index !== cocktail.fillers.length - 1 && <a>, </a>}
                </React.Fragment>
              ))}
              <br />
            </span>
          </li>
        )}
        {cocktail.accessories && (
          <li className="list-group-item">
            <span className="card-text">
              <b>Dodatki: </b>
              {cocktail.accessories.map((accessorie, index) => (
                <React.Fragment key={index}>
                  <a>{accessorie.name}{auth && auth.perm > 0 && ` x${accessorie.ml}`}</a>
                  {index !== cocktail.accessories.length - 1 && <a>, </a>}
                </React.Fragment>
              ))}
              <br />
            </span>
          </li>
        )}

        <li className="list-group-item">
          <p className="card-text">
            <b>Typ drinka: </b>
            {cocktail.type}
          </p>
        </li>
        <li className="list-group-item">
          <p className="card-text">
            <b>Metoda mieszania: </b>
            {cocktail.method}
          </p>
        </li>
        <li className="list-group-item">
          <p className="card-text">
            <b>Szkło: </b>
            {cocktail.glass}
          </p>
        </li>
        <li className="list-group-item">
          <p className="card-text">
            <b>Cena: </b>
            {cocktail.price}zł
          </p>
        </li>
      </ul>

      <div className="card-body">
        <p style={{fontSize: "0.9rem"}} className="card-text">
          {!error && message ? (
            <span className="text-success">{message}</span>
          ) : auth ? (activeBill &&
            activeBill.status === '1' ? (
              <span className="text-success">
                Masz otwarty rachunek! Możesz zamówić produkt.
              </span>
            ) : (
              <span>
                Nie masz otwartego rachunku. Otwórz go w opcjach profilu.
              </span>
            )
          ) : (
            <a className="text-danger">
              Musisz być zalogowany żeby dodać produkt do rachunku!
            </a>
          )}
        </p>
        {auth && activeBill && (
          <div className="d-flex align-items-stretch">
            <ModalNotification
              style={{ height: '2.3rem', fontSize: "0.9rem" }}
              buttonText="Zamów"
              message={`Czy na pewno chcesz dodać "${cocktail.name}" do rachunku? Nie będziesz mógł anulować tego zamówienia.`}
              buttonColor="success"
              onConfirm={handleAddToBill}
            />
            <div className="flex-grow-1 ml-2">
              {toastActive && (
                <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
