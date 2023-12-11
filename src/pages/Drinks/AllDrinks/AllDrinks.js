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
  const [sorting, setSorting] = useState('old')

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

  const sortCocktails = (cocktails) => {

    if (sorting === "new") {
      return cocktails.reverse();
    }
    if (sorting === "cheap") {
      return cocktails.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sorting === "expensive") {
      return cocktails.sort((a, b) => Number(b.price) - Number(a.price));
    }
    else {
      return cocktails;
    }
  }

  const SearchCocktails = () => {
    let newCocktails = allCocktails.filter((drink) =>
      drink.name.toUpperCase().includes(search.toUpperCase())
    );
    if (cocktailsType !== "0") {
      newCocktails = newCocktails.filter((drink) =>
        drink.type.includes(cocktailsType)
      );
    }
    setCoctails(sortCocktails(newCocktails));
  };

  useEffect(SearchCocktails, [search, cocktailsType, sorting]);

  useEffect(() => {
    fetchDrinks();
  }, []);

  return (
    <div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Wyszukaj"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label style={{ fontSize: "0.9rem" }} className="input-group-text">Typ</label>
        </div>
        <select
          value={cocktailsType}
          onChange={(e) => setCoctailsType(e.target.value)}
          className="custom-select"
          style={{ fontSize: "0.9rem" }}
        >
          <option value="0">Każdy</option>
          <option value="shot">Shot</option>
          <option value="short">Short</option>
          <option value="long">Long</option>
          <option value="premium">Premium</option>
        </select>
        <div className="input-group-prepend">
          <label style={{ fontSize: "0.9rem" }} className="input-group-text">Sortuj</label>
        </div>
        <select
          value={sorting}
          onChange={(e) => setSorting(e.target.value)}
          className="custom-select"
          style={{ fontSize: "0.9rem" }}
        >
          <option value="old">Najstarsze</option>
          <option value="new">Najnowsze</option>
          <option value="cheap">Najtańsze</option>
          <option value="expensive">Najdroższe</option>
        </select>
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
          {cocktails.length === 0 && (<div className="alert alert-warning w-100 text-center" role="alert">
            Brak drinków do wyświetlenia
          </div>)}
        </div>
      )}
    </div>
  );
}
