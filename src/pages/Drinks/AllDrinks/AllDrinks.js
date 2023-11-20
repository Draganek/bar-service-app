import useAuth from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import axios from "../../../axios"
import { useRouteMatch } from "react-router-dom";
import { objectToArrayWithId } from "../../../helpers/objects";
import DrinkCard from "../DrinkCard/DrinkCard";
import LoadingIcon from "../../../UI/LoadingIcon/LoadingIcon";

export default function AllDrinks(props) {
  const [auth] = useAuth();
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

  useEffect(() => {
    fetchDrinks();
  }, []);

  return (loading ? <LoadingIcon/> : (
    <div className="card-group" style={{ display: 'flex', flexWrap: 'wrap' }}>
      {cocktails && cocktails.map((drink) => (
        <DrinkCard drink={drink} link={`/drinks/show/${drink.id}`} style={{ height: '13rem', objectFit: "cover" }}/>
      ))}
      

      
    </div>
  ))
}
