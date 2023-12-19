import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import "./DrinkCard.module.css";

export default function DrinkCard({ drink, link, style }) {
  return (
    <div
      className="card"
      style={{ flexBasis: "calc(50% - 0.1rem)", margin: "0.05rem" }}
    >
      <figure className="position-relative">
        <img
          src={drink.image}
          className="card-img-top "
          alt={drink.name}
          style={style}
        />
        <figcaption>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-star"
            viewBox="0 2 18 16"
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
          </svg>
          {drink.rating ? drink.rating : "-"}/10
        </figcaption>
      </figure>

      <h6 className="card-header text-center" style={{ padding: "0.5rem" }}>
        {drink.name}
      </h6>
      <div
        style={{ fontSize: "0.8rem", padding: "0.5rem" }}
        className="card-body"
      >
        {drink.alcohols && (
          <span className="card-text">
            <b>Alkohole: </b>
            {drink.alcohols.map((alcohol, index) => (
              <React.Fragment key={index}>
                <a>{alcohol.name}</a>
                {index !== drink.alcohols.length - 1 && <a>, </a>}
              </React.Fragment>
            ))}
            <br />
          </span>
        )}

        {drink.fillers && (
          <span className="card-text">
            <b>Napoje: </b>
            {drink.fillers.map((filler, index) => (
              <React.Fragment key={index}>
                <a>{filler.name}</a>
                {index !== drink.fillers.length - 1 && <a>, </a>}
              </React.Fragment>
            ))}
            <br />
          </span>
        )}

        {drink.accessories && (
          <span className="card-text">
            <b>Dodatki: </b>
            {drink.accessories.map((accessorie, index) => (
              <React.Fragment key={index}>
                <a>{accessorie.name}</a>
                {index !== drink.accessories.length - 1 && <a>, </a>}
              </React.Fragment>
            ))}
            <br />
          </span>
        )}

        <span className="card-text">
          <b>Rodzaj: </b>
          <a>{drink.type}</a>
          <br />
        </span>
      </div>
      <div
        style={{ fontSize: "0.8rem", padding: "0.5rem" }}
        className="card-footer d-flex"
      >
        <a style={{ display: "flex", alignItems: "center" }}>
          <b>Cena:</b>&nbsp;{drink.price}zł
        </a>
        <Link className="btn btn-sm btn-primary ml-auto" to={link}>
          Pokaż
        </Link>
      </div>
    </div>
  );
}
