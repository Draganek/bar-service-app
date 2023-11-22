import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import ModalNotification from "../../../components/ModalNotification/ModalNotification";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import { objectToArrayWithId } from "../../../helpers/objects";

export default function DrinkInfo(props) {
  const { id } = useParams();
  const [auth] = useAuth();
  const [activeBill, setActiveBill] = useState([]);
  const [cocktail, setCoctail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        (bill) => bill.status === 1 && bill.user_id === auth.userId
      );
      setActiveBill(bill[0]);
      setLoading(false);
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }

  };

  useEffect(() => {
    fetchDrink();
    fetchBill();
  }, []);

  const handleAddToBill = async (props) => {
    if (activeBill) {
      setLoading(true);
      const items = { ...activeBill.items };
      const itemsArray = Object.values(items);

      itemsArray.push({ name: cocktail.name, price: cocktail.price, status: '0', drinkId: id, user: auth.userId });

      try {
        await axios.patch(`/bills/${activeBill.id}.json?auth=${auth.token}`, {
          items: itemsArray,
        });
        setMessage("Pomyślnie dodano drinka do rachunku!");
      } catch (ex) {
        if (ex.data.status === 401) {
          setError("Token użytkownika wygasł. Zaloguj się ponownie");
        }
      }

      fetchBill();
    } else {
      alert("Błąd: Nie masz aktywnego rachunku");
    }
  };

  return loading ? (
    <LoadingIcon />
  ) : (
    <div class="card">
      <img
        src={cocktail.image}
        class="card-img-top mx-auto border rounded"
        style={{ maxWidth: "25rem", objectFit: "cover" }}
        alt="..."
      />
      <div class="card-header">
        <h2 class="card-title text-center">{cocktail.name}</h2>
      </div>
      <div class="card-body">
        <p class="card-text">
          <b>Opis: </b>
          {cocktail.description}
        </p>
      </div>

      <ul class="list-group list-group-flush">
        {cocktail.alcohols && (
          <li class="list-group-item">
            <span className="card-text">
              <b>Alkohole: </b>
              {cocktail.alcohols.map((alcohol, index) => (
                <React.Fragment key={index}>
                  <a>{alcohol.name}</a>
                  {index !== cocktail.alcohols.length - 1 && <a>, </a>}
                </React.Fragment>
              ))}
              <br />
            </span>
          </li>
        )}
        {cocktail.fillers && (
          <li class="list-group-item">
            <span className="card-text">
              <b>Napoje: </b>
              {cocktail.fillers.map((filler, index) => (
                <React.Fragment key={index}>
                  <a>{filler.name}</a>
                  {index !== cocktail.fillers.length - 1 && <a>, </a>}
                </React.Fragment>
              ))}
              <br />
            </span>
          </li>
        )}
        {cocktail.accessories && (
          <li class="list-group-item">
            <span className="card-text">
              <b>Dodatki: </b>
              {cocktail.accessories.map((accessorie, index) => (
                <React.Fragment key={index}>
                  <a>{accessorie.name}</a>
                  {index !== cocktail.accessories.length - 1 && <a>, </a>}
                </React.Fragment>
              ))}
              <br />
            </span>
          </li>
        )}

        <li className="list-group-item">
          <p class="card-text">
            <b>Typ drinka: </b>
            {cocktail.type}
          </p>
        </li>
        <li className="list-group-item">
          <p class="card-text">
            <b>Metoda mieszania: </b>
            {cocktail.method}
          </p>
        </li>
        <li className="list-group-item">
          <p class="card-text">
            <b>Szkło: </b>
            {cocktail.glass}
          </p>
        </li>
        <li className="list-group-item">
          <p class="card-text">
            <b>Cena: </b>
            {cocktail.price}zł
          </p>
        </li>
      </ul>

      <div class="card-body">
        <p class="card-text">
          {!error && message ? (
            <span className="text-success">{message}</span>
          ) : auth ? (
            activeBill?.status === 1 ? (
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
          <ModalNotification
            buttonText="Dodaj do rachunku"
            message={`Czy na pewno chcesz dodać "${cocktail.name}" do rachunku? Nie będziesz mógł anulować tego zamówienia.`}
            buttonColor="success"
            onConfirm={handleAddToBill}
          />
        )}
      </div>
    </div>
  );
}
