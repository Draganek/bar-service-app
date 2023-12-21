import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../axios";
import ModalNotificationButton from "../../../components/ModalNotificationButton/ModalNotificationButton";
import ModalNotification from "../../../components/ModalNotification/ModalNotification";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import { objectToArrayWithId } from "../../../helpers/objects";
import TokenNotification from "../../../components/TokenNotification/TokenNotification";
import imageCustom from "../../../assets/images/custom2.jpg";

export default function CustomDrink(props) {
  const [auth, setAuth] = useAuth();
  const [drink, setDrink] = useState({
    type: "any",
    power: "any",
    description: "Chciałbym dobrego drina.",
    price: "5",
  });
  const [activeBill, setActiveBill] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenInactive, setTokenInactive] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const inputStyle = { padding: "0.7rem" };

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
        name: "Custom",
        price: drink.price,
        status: "3",
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

  const handleInput = (value, field) => {
    if (field === "price") {
      if (parseInt(value) > 30) {
        setDrink((prevState) => ({
          ...prevState,
          [field]: "30",
        }));
      } else {
        setDrink((prevState) => ({
          ...prevState,
          [field]: parseInt(value, 10).toString(),
        }));
      }
    } else {
      setDrink((prevState) => ({ ...prevState, [field]: value }));
    }
  };

  return loading ? (
    <LoadingIcon />
  ) : (
    <div className="card">
      <img
        src={imageCustom}
        className="card-img-top mx-auto border rounded"
        style={{ maxWidth: "25rem", objectFit: "cover" }}
        alt="..."
      />
      <h2
        style={{ padding: "0.1rem" }}
        className="card-title text-center card-header"
      >
        Custom Cocktail
      </h2>
      <div style={inputStyle} className="card-body">
        <p className="card-text">
          <b style={{ fontSize: "0.9rem" }}>
            Postaramy się stworzyć drinka według twoich upodobań! Wybierz
            możliwe opcje i opisz nam jakiego drinka chciałbyś otrzymać a
            zrobimy co w naszej mocy żeby ci przypasował. Pamiętaj żeby
            dopasować cenę do twoich wymagań.
          </b>
        </p>
      </div>

      <ul
        style={{ fontSize: "0.9rem" }}
        className="list-group list-group-flush"
      >
        <li className="list-group-item" style={inputStyle}>
          <div class="input-group">
            <div class="input-group-prepend">
              <label class="input-group-text">Typ Drinka</label>
            </div>
            <select class="custom-select" value={drink.type} onChange={(e) => {
                handleInput(e.target.value, "type");
              }}>
              <option value="any">Dowolny</option>
              <option value="shot">Shot</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </div>
        </li>
        <li className="list-group-item" style={inputStyle}>
          <div class="input-group">
            <div class="input-group-prepend">
              <label class="input-group-text">Stężnie alkoholu</label>
            </div>
            <select class="custom-select" value={drink.power} onChange={(e) => {
                handleInput(e.target.value, "power");
              }}>
              <option value="any">Dowolne</option>
              <option value="high">Duże</option>
              <option value="midium">Średnie</option>
              <option value="low">Małe</option>
            </select>
          </div>
        </li>
        <li className="list-group-item" style={inputStyle}>
          <label className="input-group-text">
            <span className="ml-5">Opisz co chciałbyś dostać</span>
          </label>
          <textarea
            value={drink.description}
            className="form-control"
            onChange={(e) => {
              handleInput(e.target.value, "description");
            }}
          ></textarea>
        </li>
        <li className="list-group-item" style={inputStyle}>
          <div class="input-group">
            <div class="input-group-prepend">
              <label class="input-group-text">Ile chcesz za to zapłacić</label>
            </div>
            <input
              value={drink.price}
              onChange={(e) => {
                handleInput(e.target.value, "price");
              }}
              type="number"
              min="5"
              max="30"
              className="form-control"
            />
          </div>
        </li>
      </ul>

      <div className="card-body" style={inputStyle}>
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
              disabled={parseInt(drink.price) < 5}
              width="100"
              buttonText="Zamów drinka!"
              confirmation="Oczywiście!"
              message={`Czy na pewno chcesz poprosić o zrobienie tego drinka?`}
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
