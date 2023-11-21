import axios from "../../../../../axios";
import { useHistory } from 'react-router-dom';
import useAuth from "../../../../../hooks/useAuth";
import DrinkForm from "../DrinkForm/DrinkForm";

const AddDrink = (props) => {
    const history = useHistory();
    const [auth] = useAuth();


    const submit = async form => {
        await axios.post(`/cocktails.json?auth=${auth.token}`, form);
        history.push('/services')
    }

    return (
        <div className="card">
            <h3 className="card-header">Dodaj drink</h3>
            <div className="card-body">

                <p className="text-muted">Uzupełnij dane koktajlu</p>
                <DrinkForm
                    buttonText="Zapisz drink"
                    onSubmit={submit} />
            </div>
        </div>
    );
};

export default AddDrink;
