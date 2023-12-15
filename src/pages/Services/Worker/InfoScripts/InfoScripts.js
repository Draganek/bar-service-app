import { useState } from "react";
import ModalNotification from "../../../../components/ModalNotification/ModalNotification";
import LoadingButton from "../../../../UI/LoadingButton/LoadingButton";
import { objectToArrayWithId } from "../../../../helpers/objects";
import axios from "../../../../axios";

export default function InfoScripts() {
  const [toastActive, setToastActive] = useState(false);
  const [buttons, setButtons] = useState({ alcohols: false, fillers: false, accessories: false });
  const styleTable = {
    padding: "0.2rem",
    fontSize: "1rem",
    textAlign: "center",
    verticalAlign: "middle",
  };

  const showIngredients = async (ingredient) => {
    setButtons((prevState) => ({
      ...prevState,
      [ingredient]: true,
    }));
    try {
      const res = await axios.get("/cocktails.json");
      const newData = objectToArrayWithId(res.data).filter(
        (cocktail) => cocktail.status === "1"
      );
      const wynikowyObiekt = {};
      newData.forEach((obiekt) => {
        if (obiekt[ingredient]) {
          obiekt[ingredient].forEach(({ name }) => {
            wynikowyObiekt[name] = (wynikowyObiekt[name] || 0) + 1;
          });
        }
      });

      const sortedTable = Object.entries(wynikowyObiekt)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      const firstTable = (
        <table className="table table-bordered">
          <thead>
            <tr style={styleTable}>
              <th style={{padding: "0"}}>Składnik</th>
              <th style={{padding: "0"}}>Wystąpienia</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sortedTable).map(([alkohol, iloscWystapien]) => (
              <tr style={styleTable} key={alkohol}>
                <td style={{padding: "0"}}>{alkohol}</td>
                <td style={{padding: "0"}}>{iloscWystapien}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      setToastActive({
        message: firstTable,
        tittle: "Lista Użytych Składników:",
        closeButtonColor: "primary",
        closeButtonMessage: "Ok",
        tittleColor: "success",
      });
    } catch (ex) {
      alert(ex.message);
    }
    setButtons((prevState) => ({
      ...prevState,
      [ingredient]: false,
    }));
  };


  return (
    <div style={{ fontSize: "0.8rem" }}>
      <table className="table table-bordered">
        <thead>
          <tr style={{ textAlign: "center" }}>
            <th>Narzędzie</th>
            <th>Opcje</th>
          </tr>
        </thead>
        <tbody>
          <tr style={styleTable}>
            <td style={styleTable}>Wylicz używane alkohole</td>
            <td style={styleTable}>
              <LoadingButton
                loading={buttons.alcohols}
                onClick={() => showIngredients("alcohols")}
              >
                Pokaż
              </LoadingButton>
            </td>
          </tr>
          <tr style={styleTable}>
            <td style={styleTable}>Wylicz używane fillery</td>
            <td style={styleTable}>
              <LoadingButton
                loading={buttons.fillers}
                onClick={() => showIngredients("fillers")}
              >
                Pokaż
              </LoadingButton>
            </td>
          </tr>
          <tr style={styleTable}>
            <td style={styleTable}>Wylicz używane dodatki</td>
            <td style={styleTable}>
              <LoadingButton
                loading={buttons.accessories}
                onClick={() => showIngredients("accessories")}
              >
                Pokaż
              </LoadingButton>
            </td>
          </tr>
        </tbody>
      </table>
      <ModalNotification
        showNotification={toastActive}
        onClose={(e) => setToastActive(false)}
        message={toastActive.message}
        tittle={toastActive.tittle}
        closeButtonColor={toastActive.closeButtonColor}
        closeButtonMessage={toastActive.closeButtonMessage}
        tittleColor={toastActive.tittleColor}
        confirmation={toastActive.confirmation}
      />
    </div>
  );
}
