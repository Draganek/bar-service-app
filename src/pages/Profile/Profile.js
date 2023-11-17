import DrinkDatabase from "./DrinkDatabase/DrinkDatabase";
import ProfileDetails from "./ProfileDetails/ProfileDetails";
import Bills from "./Bills/Bills"
import { Route, Switch, NavLink, useRouteMatch } from 'react-router-dom'

export default function Profile(props) {
    const { path, url } = useRouteMatch();

    return (
        <div className="card">
            <div className="card-header">
                <h2>Mój profil</h2>
            </div>
            <div className="card-body">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <NavLink className="nav-link" exact to={`${url}`}>Profil</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${url}/baza_drinkow`}>Baza drinków</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${url}/rachunki`}>Rachunki</NavLink>
                    </li>
                </ul>
                <div className="pt-4">

                    <Switch>
                        <Route path={`${path}/baza_drinkow`} component={DrinkDatabase} />
                        <Route path={`${path}/rachunki`} component={Bills} />
                        <Route path={`${path}`} component={ProfileDetails} />
                    </Switch>

                </div>

            </div>

        </div>
    )
}
