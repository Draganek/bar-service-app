import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import ModalNotificationButton from "../../../components/ModalNotificationButton/ModalNotificationButton";
import ModalNotification from "../../../components/ModalNotification/ModalNotification";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import { objectToArrayWithId } from "../../../helpers/objects";
import TokenNotification from "../../../components/TokenNotification/TokenNotification";

export default function DrinkInfo(props) {
  const { id } = useParams();
  const [auth, setAuth] = useAuth();
  const [activeBill, setActiveBill] = useState([]);
  const [cocktail, setCoctail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenInactive, setTokenInactive] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [rating, setRating] = useState("10");

  const fetchDrink = async () => {
    try {
      const res = await axios.get(`/cocktails/${id}.json`);
      setCoctail(res.data);
      if (auth) {
        if (Number(res.data.users)) {
          if (res.data.users[auth.userId]) {
            setRating(res.data.users[auth.userId]);
          }
        }
      }
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
    setLoading(false);
  };

  const fetchBill = async () => {
    try {
      const res = await axios.get(`/bills.json`);
      const bill = objectToArrayWithId(res.data).filter(
        (bill) => parseInt(bill.status) === 1 && bill.user_id === auth.userId
      );
      setActiveBill(bill[0]);
    } catch (ex) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchDrink();
    fetchBill();
  }, []);

  const isBillActive = async () => {
    try {
      const res = await axios.get(`/bills.json`);
      const bill = objectToArrayWithId(res.data).filter(
        (bill) => parseInt(bill.status) === 1 && bill.user_id === auth.userId
      );
      if (Number(bill.length) > 0) {
        return true;
      } else {
        return false;
      }
    } catch (ex) {}
    return false;
  };

  const handleAddToBill = async (props) => {
    if (await isBillActive()) {
      setLoading(true);
      const items = {
        name: cocktail.name,
        price: cocktail.price,
        status: "3",
        drinkId: id,
        user: auth.userId,
      };
      try {
        await axios.post(
          `/bills/${activeBill.id}/items.json?auth=${auth.token}`,
          items
        );
        setToastActive({
          message: "Pomyślnie dodano drinka do rachunku!",
          tittle: "Gratulacje",
          closeButtonColor: "primary",
          closeButtonMessage: "Świetnie",
          tittleColor: "success",
        });
      } catch (ex) {
        setTokenInactive(true);
      }
      fetchBill();
    } else {
      setToastActive({
        message: "Nie masz aktywnego rachunku",
        tittle: "Błąd",
        closeButtonColor: "primary",
        closeButtonMessage: "Rozumiem",
        tittleColor: "danger",
      });
      fetchBill();
    }
  };

  const rateDrink = async () => {
    setLoading(true);
    try {
      await axios.patch(`/cocktails/${id}/users.json?auth=${auth.token}`, {
        [auth.userId]: rating,
      });
      const res = await axios.get(`/cocktails/${id}.json`);
      const ratings = Object.values(res.data.users);
      const ratingsSum = ratings.reduce(
        (sum, ocena) => sum + parseInt(ocena, 10),
        0
      );
      const sredniaOcen = ratingsSum / ratings.length;
      await axios.patch(`/cocktails/${id}.json?auth=${auth.token}`, {
        rating:
          sredniaOcen % 1 === 0
            ? sredniaOcen.toFixed(0)
            : sredniaOcen.toFixed(1),
      });
      if (Number(rating) >= 5) {
        setToastActive({
          message:
            "Dziękujemy za ocenę drinka. Twoja opinia została wzięta pod uwagę w ogólnej ocenie :D",
          tittle: "Dziękujemy",
          closeButtonColor: "primary",
          closeButtonMessage: "Fajnie",
          tittleColor: "success",
        });
      }else{
        setToastActive({
          message: "Dziękujemy za ocenę drinka. Przykro nam że produkt ci nie odpowiada. Postaramy się poprawić :)",
          tittle: "Dziękujemy",
          closeButtonColor: "primary",
          closeButtonMessage: "Fajnie",
          tittleColor: "success",
        });
      }

      fetchDrink();
    } catch (ex) {
      setTokenInactive(true);
    }
    setLoading(false);
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
      <h3 className="card-title text-center card-header">{cocktail.name}</h3>
      <div style={{ fontSize: "0.9rem" }} className="card-body">
        <p className="card-text">
          <b>Opis: </b>
          {cocktail.description}
        </p>
      </div>

      <ul
        style={{ fontSize: "0.9rem" }}
        className="list-group list-group-flush"
      >
        <li className="list-group-item container">
          <div className="row">
            <div
              className="col"
              style={{ display: "flex", alignItems: "center" }}
            >
              <b>Ocena:&nbsp;</b>
              {cocktail.rating ? cocktail.rating + "/10" : "Brak ocen"}
            </div>
            {auth && (
              <div className="col input-group">
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="custom-select ml-4"
                  style={{ fontSize: "0.8rem" }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
                <div className="input-group-append">
                  <button
                    className="btn btn-success mr-1"
                    type="button"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => {
                      rateDrink();
                    }}
                  >
                    Oceń
                  </button>
                </div>
              </div>
            )}
          </div>
        </li>
        {cocktail.alcohols && (
          <li className="list-group-item">
            <span className="card-text">
              <b>Alkohole: </b>
              {cocktail.alcohols.map((alcohol, index) => (
                <React.Fragment key={index}>
                  <a>
                    {alcohol.name}
                    {auth && auth.perm > 0 && ` ${alcohol.ml}ml`}
                  </a>
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
                  <a>
                    {filler.name}
                    {auth && auth.perm > 0 && ` ${filler.ml}ml`}
                  </a>
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
                  <a>
                    {accessorie.name}
                    {auth && auth.perm > 0 && ` x${accessorie.ml}`}
                  </a>
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
            <b>Metoda: </b>
            {cocktail.method === "shake" && "Wstrząśnięte"}
            {cocktail.method === "mix" && "Mieszane"}
          </p>
        </li>
        <li className="list-group-item">
          <p className="card-text">
            <b>Szkło: </b>
            {cocktail.glass === "wine" && "Kieliszek"}
            {cocktail.glass === "short" && "Niskie"}
            {cocktail.glass === "high" && "Wysokie"}
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
        <p style={{ fontSize: "0.9rem" }} className="card-text">
          {!error && message ? (
            <span
              style={{
                fontSize: "0.8rem",
                alignItems: "center",
                textAlign: "center",
              }}
              className="alert alert-success d-flex justify-content-center"
            >
              {message}
            </span>
          ) : auth ? (
            activeBill && activeBill.status === "1" ? (
              <span
                style={{
                  fontSize: "0.8rem",
                  alignItems: "center",
                  textAlign: "center",
                }}
                className="alert alert-success d-flex justify-content-center"
              >
                Masz otwarty rachunek! Możesz zamówić produkt.
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.8rem",
                  alignItems: "center",
                  textAlign: "center",
                }}
                className="alert alert-warning d-flex justify-content-center"
              >
                Nie masz otwartego rachunku. Otwórz go w opcjach profilu.
              </span>
            )
          ) : (
            <span
              style={{
                fontSize: "0.8rem",
                alignItems: "center",
                textAlign: "center",
              }}
              className="alert alert-danger d-flex justify-content-center"
            >
              Musisz być zalogowany żeby dodać produkt do rachunku!
            </span>
          )}
        </p>
        {auth && activeBill && (
          <div className="d-flex align-items-stretch">
            <ModalNotificationButton
              style={{ fontSize: "0.9rem" }}
              width="100"
              buttonText="Zamów drinka!"
              confirmation="Oczywiście!"
              message={`Czy na pewno chcesz dodać "${cocktail.name}" do rachunku?`}
              buttonColor="primary"
              onConfirm={handleAddToBill}
            />
          </div>
        )}
      </div>
      <ModalNotification
        showNotification={toastActive}
        onClose={(e) => setToastActive(false)}
        message={toastActive.message}
        tittle={toastActive.tittle}
        closeButtonColor={toastActive.closeButtonColor}
        closeButtonMessage={toastActive.closeButtonMessage}
        tittleColor={toastActive.tittleColor}
        confirmation={toastActive.confirmation}
      />
      <TokenNotification
        showNotification={tokenInactive}
        onClose={() => {
          setTokenInactive(false);
        }}
      />
    </div>
  );
}
