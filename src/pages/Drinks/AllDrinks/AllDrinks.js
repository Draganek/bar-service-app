import useAuth from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import axios from "../../../axios"
import { useRouteMatch } from "react-router-dom";
import { objectToArrayWithId } from "../../../helpers/objects";
import DrinkCard from "../DrinkCard/DrinkCard";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";

export default function AllDrinks(props) {
  const [auth] = useAuth();
  const [search, setSearch] = useState("")
  const { url } = useRouteMatch();
  const [cocktails, setCoctails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrinks = async () => {
    try {
      const res = await axios.get("/cocktails.json");
      const newData = objectToArrayWithId(res.data).filter(
        (cocktail) => cocktail.status === "1"
      );
      setCoctails(newData);
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
    setLoading(false);
  };

  const inputChangeHandler = async (value) => {
    setSearch(value);
    setLoading(true)
    try {
      const res = await axios.get("/cocktails.json");
      const newData = objectToArrayWithId(res.data).filter(
        (cocktail) => cocktail.status === "1"
      );
      const newCocktails = newData.filter(drink => drink.name.toUpperCase().includes(value.toUpperCase()))
      setCoctails(newCocktails)
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDrinks();
  }, []);

  return (
    <div>
      <input type="text" className="form-control mb-1" placeholder="Wyszukaj" value={search} onChange={e => inputChangeHandler(e.target.value)}/>
      {loading ? <LoadingIcon /> : (<div className="card-group" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {cocktails && cocktails.map((drink) => (
          <DrinkCard key={drink.id} drink={drink} link={`/drinks/show/${drink.id}`} style={{ height: '10rem', objectFit: "cover" }} />
        ))}
      </div>)}
    </div>
  )
}
