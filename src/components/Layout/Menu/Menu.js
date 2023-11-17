import React from "react";
import style from "./Menu.module.css";
import useAuth from "../../../hooks/useAuth";
import { NavLink } from "react-router-dom";

function Menu() {
  const [auth, setAuth] = useAuth();

  const logout = (e) => {
    e.preventDefault();
    setAuth(false);
  };
  return (
    <div
      className={`${style.menuContainer} breadcrumb bg-dark justify-content-between`}
    >
      <ul className={`${style.menu}`}>
        <li className={style.menuItem}>
          <NavLink to="/" exact activeClassName={style.menuItemActive}>
            Home
          </NavLink>
        </li>

        <li className={style.menuItem}>
          <NavLink to="/drinks" exact activeClassName={style.menuItemActive}>
            Drinki
          </NavLink>
        </li>

        <li className={style.menuItem}>
          <NavLink to="/news" exact activeClassName={style.menuItemActive}>
            News
          </NavLink>
        </li>

      </ul>
      <ul className={`${style.menu}`}>
        {auth ? (
          <>
            <li className={`${style.menuItem}`}>
              <NavLink to="/profil" activeClassName={style.menuItemActive}>
                Mój profil
              </NavLink>
            </li>

            <li className={`${style.menuItem}`}>
              <a href="#" onClick={logout}>
                Wyloguj
              </a>
            </li>
          </>
        ) : (
          <>
            <li className={style.menuItem}>
              <NavLink activeClassName={style.menuItemActive} to="/rejestracja">
                Register
              </NavLink>
            </li>

            <li className={style.menuItem}>
              <NavLink activeClassName={style.menuItemActive} to="/zaloguj">
                log in
              </NavLink> 
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Menu;
