import React from "react";
import style from "./Menu.module.css";
import useAuth from "../../../hooks/useAuth";
import { NavLink } from "react-router-dom";

function Menu() {
  const [auth] = useAuth();


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
          <NavLink to="/drinks" activeClassName={style.menuItemActive}>
            Drinki
          </NavLink>
        </li>

        <li className={style.menuItem}>
          <NavLink to="/news" activeClassName={style.menuItemActive}>
            Nowe
          </NavLink>
        </li>
      </ul>
      <ul className={`${style.menu}`}>
        {auth ? (
          <>
            { auth.perm && Number(auth.perm) > 0 && (<li className={`${style.menuItem}`}>
              <NavLink to="/services" activeClassName={style.menuItemActive}>
                Usługi
              </NavLink>
            </li>)}
            

            <li className={`${style.menuItem}`}>
              <NavLink to="/profil" activeClassName={style.menuItemActive}>
                Mój profil
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className={style.menuItem}>
              <NavLink activeClassName={style.menuItemActive} to="/rejestracja">
                Rejestracja
              </NavLink>
            </li>

            <li className={style.menuItem}>
              <NavLink activeClassName={style.menuItemActive} to="/zaloguj">
                Zaloguj
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Menu;
