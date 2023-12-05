import { useState, useEffect } from "react";
import axios from "../../../axios";
import { objectToArrayWithId } from "../../../helpers/objects";
import DrinkCard from "../DrinkCard/DrinkCard";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";

export default function AllDrinks(props) {
  const [search, setSearch] = useState("");
  const [allCocktails, setAllCoctails] = useState([]);
  const [cocktails, setCoctails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cocktailsType, setCoctailsType] = useState("0");

  const fetchDrinks = async () => {
    try {
      const res = await axios.get("/cocktails.json");
      const newData = objectToArrayWithId(res.data).filter(
        (cocktail) => cocktail.status === "1"
      );
      setAllCoctails(newData);
      setCoctails(newData);
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
    setLoading(false);
  };

  const SearchCocktails = () => {
    setLoading(true);
    let newCocktails = allCocktails.filter((drink) =>
      drink.name.toUpperCase().includes(search.toUpperCase())
    );
    if (cocktailsType !== "0") {
      newCocktails = newCocktails.filter((drink) =>
        drink.type.includes(cocktailsType)
      );
    }
    setCoctails(newCocktails);
    setLoading(false);
  };

  useEffect(SearchCocktails, [search, cocktailsType]);

  useEffect(() => {
    fetchDrinks();
  }, []);

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Wyszukaj"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="input-group-append">
          <select
            value={cocktailsType}
            onChange={(e) => setCoctailsType(e.target.value)}
            className="custom-select"
          >
            <option value="0">Wszystkie</option>
            <option value="shot">Shot</option>
            <option value="short">Short</option>
            <option value="long">Long</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingIcon />
      ) : (
        <div
          className="card-group"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {cocktails &&
            cocktails.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                link={`/drinks/show/${drink.id}`}
                style={{ height: "10rem", objectFit: "cover" }}
              />
            ))}
        </div>
      )}
    </div>
  );
}
