import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

export default function DrinkCard({ drink, link, style }) {
  return (
    <div
      className="card"
      style={{ flexBasis: "calc(50% - 0.1rem)", margin: "0.05rem" }}
    >
      <img
        src={drink.image}
        className="card-img-top "
        alt="..."
        style={style}
      />
      <h6 className="card-header text-center" style={{padding: "0.5rem"}}>{drink.name}</h6>
      <div style={{fontSize: "0.8rem", padding: "0.5rem"}} className="card-body">
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
      <div style={{fontSize: "0.8rem", padding: "0.5rem"}} className="card-footer d-flex">
        <a style={{ display: "flex", alignItems: "center" }}>
          <b>Cena:</b>&nbsp;{drink.price}zł
        </a>
        <Link className="btn btn-sm btn-primary ml-auto" to={link} >Pokaż</Link>
      </div>
    </div>
  );
}
