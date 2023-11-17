import axios from "../../../../axios";
import { useHistory } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import HotelForm from "../DrinkForm"

const AddDrink = (props) => {
    const history = useHistory();
    const [auth] = useAuth();


    const submit = async form => {
        await axios.post(`/cocktails.json?auth=${auth.token}`, form);
        history.push('/profil/hotele')
    }

    return (
        <div className="card">
            <h3 className="card-header">Dodaj drink</h3>
            <div className="card-body">

                <p className="text-muted">Uzupełnij dane koktajlu</p>
                <HotelForm
                    buttonText="Zapisz drink"
                    onSubmit={submit} />
            </div>
        </div>
    );
};

export default AddDrink;
