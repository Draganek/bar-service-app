import { Route, Switch, NavLink, useRouteMatch } from 'react-router-dom'
import useAuth from "../../../hooks/useAuth";
import SetPermissions from './SetPermissions/SetPermissions';

export default function Services(props) {
    const { path, url } = useRouteMatch();
    const [auth, setAuth] = useAuth();

    const isNavLinkActive = (match, location) => {
        return url === "/services";
    };

    return (


        <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "0.5rem" }}>
                <h4>System</h4>
                <ul className="nav nav-pills" style={{fontSize: "0.9rem"}}>
                    <li className="nav-item">
                        <NavLink className="nav-link" isActive={isNavLinkActive} to={`/services`}>Pracownik</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to={`/services/admin`}>Administrator</NavLink>
                    </li>

                </ul>
            </div>
            <div className="card-body">
                <ul className="nav nav-tabs" style={{fontSize: "0.9rem"}}>
                    <li className="nav-item">
                        <NavLink className="nav-link" exact to={`${url}`}>Uprawnienia</NavLink>
                    </li>

                </ul>
                <div className="pt-4">

                    <Switch>

                        <Route path={`${path}`} component={SetPermissions} />

                    </Switch>

                </div>

            </div>

        </div>
    )
}
