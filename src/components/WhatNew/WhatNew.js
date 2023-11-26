import React from "react";
import Logo from "../../assets/images/Logo.png";
import { Carousel } from "react-bootstrap";
import "./WhatNew.css";

function WhatNew(props) {
  return (
    <Carousel fade className="card">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://paradigmspirits.com/cdn/shop/files/Untitled_design-6_600x.png?v=1678314643"
          alt="First slide"
        />
        <Carousel.Caption>
          <h5>Witaj na stronie głównej naszego baru!</h5>
          <h6>Znajdź chwilę i zapoznaj się z naszą ofertą</h6>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={Logo} alt="First slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://bottlenose.imgix.net/bottleshop.com/l6eStelT3Q"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h2>Jesteś ciekaw co u nas?</h2>
          <h6>Wejdź w zakładkę: Aktualności</h6>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default WhatNew;
