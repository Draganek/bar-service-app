import axios from "../../../../axios";
import { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { objectToArrayWithId } from "../../../../helpers/objects";
import useAuth from "../../../../hooks/useAuth";
import ModalNotification from "../../../../components/ModalNotification/ModalNotification";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";

export default function DrinkDatabase() {
  const [auth] = useAuth();
  const { url } = useRouteMatch();
  const [cocktails, setCoctails] = useState([]);
  const [loading, setLoading] = useState(true)

  const fetchDrinks = async () => {
    try {
      const res = await axios.get("/cocktails.json");
      const newData = objectToArrayWithId(res.data)
      setCoctails(newData);
    } catch (ex) {
      alert(JSON.stringify(ex.message));
    }
    setLoading(false)
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`/cocktails/${id}.json?auth=${auth.token}`);
      setCoctails(cocktails.filter((x) => x.id !== id));
    } catch (ex) {
      alert(JSON.stringify(ex.response));
    }
  };

  useEffect(() => {
    setLoading(true)
    fetchDrinks();
  }, []);

  return (loading ? <LoadingIcon/> : (
    <div>
      {cocktails.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Status</th>
              <th>Cena</th>
              <th>Opcje</th>
            </tr>
          </thead>
          <tbody>
            {cocktails.map((cocktail) => (
              <tr key={cocktail.id}>
                <td>{cocktail.name}</td>
                <td>
                  {parseInt(cocktail.status) === 1 ? (
                    <span className="badge bg-success text-light">Aktywny</span>
                  ) : (
                    <span className="badge bg-secondary text-light">
                      Ukryty
                    </span>
                  )}
                </td>
                <td>{cocktail.price}zł</td>
                <td>
                  <Link
                    to={`/services/edytuj/${cocktail.id}`}
                    className="btn btn-warning mr-1"
                  >
                    Edytuj
                  </Link>
                  <ModalNotification
                    onConfirm={() => deleteHandler(cocktail.id)}
                    message={`Czy na pewno chcesz usunąć drink ${cocktail.name} z bazy danych?`}
                    tittle="Uwaga!"
                    buttonText="Usuń"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h6>Nie znaleziono drinków :(</h6>
      )}
      <Link to={`${url}/dodaj`} className="btn btn-primary">
        Dodaj drink
      </Link>
    </div>)
  );
}
