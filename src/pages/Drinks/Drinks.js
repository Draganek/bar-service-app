import { Route, Switch, NavLink, useRouteMatch } from "react-router-dom";
import AllDrinks from "./AllDrinks/AllDrinks"
import RandomDrink from "./RandomDrink/RandomDrink";

export default function Drinks(props) {
  const { path, url } = useRouteMatch();

  return (
    <div className="card">
      <div className="card-body">
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
        <div className="pt-4">
          <Switch>
            
            <Route path={`${path}/random`} component={RandomDrink} />
            <Route path={`${path}`} component={AllDrinks} />
          </Switch>
        </div>
      </div>
    </div>
  );
}
