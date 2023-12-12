import { useState } from "react";
import axios from "../../../../../axios";
import { useHistory } from 'react-router-dom';
import useAuth from "../../../../../hooks/useAuth";
import DrinkForm from "../DrinkForm/DrinkForm";
import TokenNotification from "../../../../../components/TokenNotification/TokenNotification";

const AddDrink = (props) => {
    const history = useHistory();
    const [auth] = useAuth();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");
    const [tokenInactive, setTokenInactive] = useState(false);

    const submit = async form => {
        setLoading(true);
        try {
            await axios.post(`/cocktails.json?auth=${auth.token}`, form);
            history.push('/services/drinks_database')
        } catch (ex) {
            if (ex.response.status === 401) {
                setTokenInactive(true)
            } else {
                setError(ex.message);
            }
            setLoading(false)
        }

    }

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
            <TokenNotification
                showNotification={tokenInactive}
                onClose={() => { setTokenInactive(false) }}
            />
        </div>
    );
};

export default AddDrink;
