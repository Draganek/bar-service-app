import axios from "../../../../../axios";
import { useHistory } from 'react-router-dom';
import useAuth from "../../../../../hooks/useAuth";
import DrinkForm from "../../../../Services/Worker/DrinkDatabase/DrinkForm/DrinkForm"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ToastMessage from "../../../../../components/ToastMessage/ToastMessage";

const EditDrink = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const [drink, setDrink] = useState(null);
    const [auth] = useAuth();
    const [error, setError] = useState("");
    const [toastActive, setToastActive] = useState(false);
    const [loading, setLoading] = useState(false)

    const submit = async form => {
        setLoading(true)
        try {
            await axios.patch(`/cocktails/${id}.json?auth=${auth.token}`, form);
            history.push('/services')
        } catch (ex) {
            if (ex.response.status === 401) {
                handleToggleToast();
            } else {
                setError(ex.message);
            }
            setLoading(false)
        }

    }

    const fetchHotel = async () => {
        const res = await axios.get(`/cocktails/${id}.json`);
        const drinkData = res.data;
        delete (drinkData.user_id)
        setDrink(drinkData);
    }

    useEffect(() => {
        fetchHotel();
    }, [])

    const handleToggleToast = () => {
        setToastActive(!toastActive);
    };

    return (
        <div className="card">
            <div className="card-header">Edytuj drink</div>
            <div className="card-body">

                <p className="text-muted">Uzupełnij dane koktajlu</p>
                <DrinkForm
                    drink={drink}
                    buttonText="Zapisz edycje"
                    onSubmit={submit}
                    loading={loading} />

            </div>
            {error && <span className="alert alert-danger">{error}</span>}
            {toastActive && (
                <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
            )}
        </div>
    );
};

export default EditDrink;
