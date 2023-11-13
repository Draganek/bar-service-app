import React, { useState } from "react";
import style from "./Menu.module.css";


function Menu() {
  const [auth, setAuth] = useState(true);

  return (
    <div
      className={`${style.menuContainer} breadcrumb bg-dark justify-content-between`}
    >
      <ul className={`${style.menu}`}>
        <li className={style.menuItem}>
          <a to="/" exact activeClassName={style.menuItemActive}>
            Home
          </a>
        </li>
        <li className={style.menuItem}>
          <a to="/News" exact activeClassName={style.menuItemActive}>
            News
          </a>
        </li>
      </ul>
      <ul className={`${style.menu}`}>
        {auth ? (
          <>
            <li className={`${style.menuItem}`}>
              <a to="/profil" activeClassName={style.menuItemActive}>
                Mój profil
              </a>
            </li>
            <li className={`${style.menuItem}`}>
              <a href="#" >
                Wyloguj
              </a>
            </li>
          </>
        ) : (
          <>
            <li className={style.menuItem}>
              <a activeClassName={style.menuItemActive} to="/rejestracja">
                Register
              </a>
            </li>
            <li className={style.menuItem}>
              <a activeClassName={style.menuItemActive} to="/zaloguj">
                log in
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Menu;
