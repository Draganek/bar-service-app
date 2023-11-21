import axios from "../../../../../axios";
import { useHistory } from 'react-router-dom';
import useAuth from "../../../../../hooks/useAuth";
import DrinkForm from "../../../../Services/Worker/DrinkDatabase/DrinkForm/DrinkForm"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const EditDrink = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const [drink, setDrink] = useState(null);
    const [auth] = useAuth();

    const submit = async form => {
        await axios.patch(`/cocktails/${id}.json?auth=${auth.token}`, form);
        history.push('/services')
    }

    const fetchHotel = async () => {
        const res = await axios.get(`/cocktails/${id}.json`);
        const drinkData = res.data;
        delete(drinkData.user_id)
        setDrink(drinkData);
    }

    useEffect(() => {
        fetchHotel();
    }, [])

    return (
        <div className="card">
            <div className="card-header">Edytuj drink</div>
            <div className="card-body">

                <p className="text-muted">Uzupełnij dane koktajlu</p>
                <DrinkForm
                    drink={drink}
                    buttonText="Zapisz edycje"
                    onSubmit={submit} />
            </div>
        </div>
    );
};

export default EditDrink;
