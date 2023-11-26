import ProfileDetails from "./ProfileDetails/ProfileDetails";
import Bills from "./Bills/Bills"
import { Route, Switch, NavLink, useRouteMatch } from 'react-router-dom'
import style from "./Profile.module.css"
import useAuth from "../../hooks/useAuth";

export default function Profile(props) {
    const { path, url } = useRouteMatch();
    const [auth, setAuth] = useAuth();

    const logout = (e) => {
        setAuth(false);
      };

    return (
        <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Mój profil</h3>
                <button className={style.logout} onClick={e => logout()}>
                    Wyloguj
                </button>
            </div>
            <div className="card-body">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <NavLink className="nav-link" exact to={`${url}`}>Profil</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`${url}/rachunki`}>Rachunki</NavLink>
                    </li>
                </ul>
                <div className="pt-4">

                    <Switch>
                        <Route path={`${path}/rachunki`} component={Bills} />
                        <Route path={`${path}`} component={ProfileDetails} />
                    </Switch>

                </div>

            </div>

        </div>
    )
}
