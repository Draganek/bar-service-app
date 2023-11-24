import { useState } from "react";
import axios from "../../../../../axios";
import { useHistory } from 'react-router-dom';
import useAuth from "../../../../../hooks/useAuth";
import DrinkForm from "../DrinkForm/DrinkForm";
import ToastMessage from "../../../../../components/ToastMessage/ToastMessage";

const AddDrink = (props) => {
    const history = useHistory();
    const [auth] = useAuth();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");
    const [toastActive, setToastActive] = useState(false);

    const submit = async form => {
        setLoading(true);
        try {
            await axios.post(`/cocktails.json?auth=${auth.token}`, form);
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

    const handleToggleToast = () => {
        setToastActive(!toastActive);
    };

    return (
        <div className="card">
            <h3 className="card-header">Dodaj drink</h3>
            <div className="card-body">

                <p className="text-muted">Uzupełnij dane koktajlu</p>
                <DrinkForm
                    buttonText="Zapisz drink"
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

export default AddDrink;
