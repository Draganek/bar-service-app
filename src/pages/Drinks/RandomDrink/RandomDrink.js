import { useState, useEffect } from "react";
import axios from "../../../axios";
import { objectToArrayWithId } from "../../../helpers/objects";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";
import randomDrinkImage from "../../../assets/images/random.jpg";
import DrinkCard from "../DrinkCard/DrinkCard";

export default function RandomDrink(props) {
  const [loadingTime] = useState(2);
  const [loadingDrink, setLoadingDrink] = useState(false);
  const [text, setText] = useState("");
  const [cocktails, setCoctails] = useState([]);
  const [drawtedDrink, setDrawtedDrink] = useState();
  const [loading, setLoading] = useState(true);

  const fetchDrinks = async () => {
    try {
      const res = await axios.get("/cocktails.json");
      const newData = objectToArrayWithId(res.data).filter(
        (cocktail) => cocktail.status === "1");
      setCoctails(newData);
      setLoading(false);
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
  };

  const handleClick = () => {
    setLoadingDrink(true);
    setTimeout(() => {
      handleRandomDrink();
    }, loadingTime * 1000);
    IterateNames();
  };

  const IterateNames = (i = 0) => {
    setText(cocktails[Math.floor(Math.random() * cocktails.length)].name);
    if (i < loadingTime * 8 - 1) {
      setTimeout(function () {
        IterateNames(i + 1);
      }, 125);
    }
  };

  const handleRandomDrink = () => {
    const losowyIndex = Math.floor(Math.random() * cocktails.length);
    setDrawtedDrink(cocktails[losowyIndex]);
    setLoadingDrink(false);
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  return loading ? (
    <LoadingIcon />
  ) : (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loadingDrink ? (
          <div className="m-5">
            {
              <>
                <div className="text-center">
                  <h3>Trwa losowanie...</h3>
                </div>
                <LoadingIcon color="danger" />
                <p className="text-center">{text}</p>
              </>
            }
          </div>
        ) : drawtedDrink ? (
          drawtedDrink && (
            <div style={{ marginLeft: "3rem", marginRight: "3rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
              <DrinkCard
                drink={drawtedDrink}
                link={`/drinks/show/${drawtedDrink.id}`}
                height="200px"
              />
            </div>
          )
        ) : (
          <img
            src={randomDrinkImage}
            className="card-img-top"
            style={{
              height: "20rem",
              width: "20rem",
            }}
            alt="..."
          />
        )}
      </div>

      <div className="card-header">
        <h4 className="text-center">Losuj pozycje!</h4>
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item text-center">
          Naciśnij przycisk, żeby rozpocząć losowanie
        </li>
      </ul>
      <div className="card-body">
        <button
          onClick={handleClick}
          className="btn btn-primary btn-lg btn-block mt-3"
          disabled={loadingDrink}
        >
          Losuj!
        </button>
      </div>
    </div>
  );
}
