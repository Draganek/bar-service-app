import DrinkDatabase from "./Worker/DrinkDatabase/DrinkDatabase";
import { Route, Switch, NavLink, useRouteMatch } from 'react-router-dom'
import Approvals from "../Services/Worker/Approvals/Approvals";
import useAuth from "../../hooks/useAuth";
import DrinksAprove from "./Worker/DrinksAprove/DrinksAprove";

export default function Services(props) {
    const { path, url } = useRouteMatch();
    const [auth] = useAuth();

    const isNavLinkActive = (match, location) => {
        return url === "/services";
    };

    return (


        <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Obsługa</h4>
                <ul className="nav nav-pills" style={{fontSize: "0.9rem"}}>
                    <li className="nav-item">
                        <NavLink className="nav-link " isActive={isNavLinkActive} to={`/services`}>Pracownik</NavLink>
                    </li>
                    {auth.perm && Number(auth.perm) >= 2 && (<li className="nav-item">
                        <NavLink className="nav-link" to={`/services/admin`}>Administrator</NavLink>
                    </li>)}


                </ul>
            </div>
            <div className="card-body">
                <ul className="nav nav-tabs" style={{fontSize: "0.9rem"}}>

                    <li className="nav-item">
                        <NavLink className="nav-link" exact to={`${url}`}>Zamówienia</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" exact to={`${url}/drinks_database`}>Baza</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${url}/zatwierdzenia`}>Zatwierdzenia</NavLink>
                    </li>
                </ul>
                <div className="pt-4">

                    <Switch>

                        <Route path={`${path}/drinks_database`} component={DrinkDatabase} />
                        <Route path={`${path}/zatwierdzenia`} component={Approvals} />
                        <Route path={`${path}`} component={DrinksAprove} />

                    </Switch>

                </div>

            </div>

        </div>
    )
}
