import { Route, Switch, NavLink, useRouteMatch } from "react-router-dom";
import AllDrinks from "./AllDrinks/AllDrinks"
import RandomDrink from "./RandomDrink/RandomDrink";
import { useLocation } from "react-router-dom";

export default function Drinks(props) {
  const { path, url } = useRouteMatch();
  const location = useLocation();

  return (
    <div className="card" >
      <div className="card-body" style={{padding: "0.1rem"}}>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink className="nav-link" exact to={`${url}`}>
              Wszystkie
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${url}/random`}>
              Losowe
            </NavLink>
          </li>
        </ul>
        <div className="pt-4" style={location.pathname === "/drinks/random" ? {padding: "1.5rem"} : {padding: "0.3rem"}}>
          <Switch>
            
            <Route path={`${path}/random`} component={RandomDrink} />
            <Route path={`${path}`} component={AllDrinks} />
          </Switch>
        </div>
      </div>
    </div>
  );
}
