import axios from "../../../../axios";
import { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { objectToArrayWithId } from "../../../../helpers/objects";
import useAuth from "../../../../hooks/useAuth";
import ModalNotification from "../../../../components/ModalNotification/ModalNotification";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";
import ToastMessage from "../../../../components/ToastMessage/ToastMessage";
import CustomWrap from "../../../../components/CustomWrap/CustomWrap";

export default function DrinkDatabase() {
  const [auth] = useAuth();
  const { url } = useRouteMatch();
  const [cocktails, setCoctails] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("");
  const [toastActive, setToastActive] = useState(false);

  const fetchDrinks = async () => {
    try {
      const res = await axios.get("/cocktails.json");
      const newData = objectToArrayWithId(res.data)
      setCoctails(newData);
    } catch (ex) {
      setError(ex.message);
    }
    setLoading(false)
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`/cocktails/${id}.json?auth=${auth.token}`);
      setCoctails(cocktails.filter((x) => x.id !== id));
    } catch (ex) {
      if (ex.response.status === 401) {
        handleToggleToast();
      } else {
        setError(ex.message);
      }
    }
  };

  useEffect(() => {
    setLoading(true)
    fetchDrinks();
  }, []);

  const handleToggleToast = () => {
    setToastActive(!toastActive);
  };

  return (loading ? <LoadingIcon /> : (
    <div>
      {cocktails.length > 0 ? (
        <table className="table table-bordered" style={{fontSize: "0.8rem"}}>
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
                    to={`/services/drinks_database/edytuj/${cocktail.id}`}
                    className="btn btn-sm btn-warning"
                  >
                    Edytuj
                  </Link>
                  <ModalNotification
                    small={true}
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
      <div className="d-flex align-items-stretch">
        <Link to={`${url}/dodaj`} className="btn btn-primary" style={{height: '2.5rem'}}>
          Dodaj drink
        </Link>
        <div className="flex-grow-1">
        {error && <span className="alert alert-danger">{error}</span>}
        {toastActive && (
          <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
        )}
        </div>
      </div>

    </div>)
  );
}
