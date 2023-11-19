import React, { useEffect, useState } from "react";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import LoadingIcon from "../../UI/LoadingIcon/LoadingIcon";
import WhatNew from "../../components/WhatNew/WhatNew";
import { Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

export default function Home(props) {
  const [auth] = useAuth();
  useWebsiteTitle("Strona główna");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return loading ? (
    <LoadingIcon />
  ) : (
    <>
      {auth && (
        <h5 className="text-right">Witaj! <span class="badge badge-secondary">{auth.name}</span></h5>
      )}
      <WhatNew />
      <div className="pt-2">
        <Alert variant="secondary" className="pt-400">
          <Alert.Heading>Witaj w Dragan Bar! </Alert.Heading>
          <p>
            Jesteśmy dumni, że możemy cię gościć w naszym niezwykłym miejscu,
            gdzie każdy wieczór staje się wyjątkowy i pełen przygód. Nasza pasja
            to tworzenie niezapomnianych chwil i dostarczanie niepowtarzalnych
            doświadczeń.
          </p>
          <hr />
          <p className="mb-0">
            Dragan Bar to nie tylko bar. To magiczne miejsce, gdzie spotyka się
            dobra zabawa, dobre towarzystwo i doskonały smak. Nasza historia
            zaczyna się od miłości do doskonałych drinków i wyjątkowej
            atmosfery, którą chcemy dzielić z tobą.
          </p>
          <hr />
          <p className="mb-0">
            Nasz zespół pracuje z pasją, aby serwować ci najlepsze napoje,
            smakowite przekąski i dostarczać rozrywkę na najwyższym poziomie.
            Nasze menu to kwintesencja smaków - od klasycznych drinków po
            autorskie kompozycje, które zaskoczą twoje kubki smakowe.
          </p>
          <hr />
          <p className="mb-0">
            W Dragan Bar znajdziesz więcej niż tylko drinki. To miejsce, w
            którym rodzą się nowe znajomości, gdzie śmiech staje się głównym
            akcentem wieczoru, a muzyka jest sercem zabawy. Nasze wydarzenia
            tematyczne, koncerty na żywo i imprezy to okazje do spędzenia
            niezapomnianego wieczoru w towarzystwie przyjaciół i ludzi o
            podobnych zainteresowaniach.
          </p>
        </Alert>
      </div>
    </>
  );
}
