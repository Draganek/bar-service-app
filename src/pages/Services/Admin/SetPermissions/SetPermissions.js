import { useEffect, useState } from "react";
import LoadingButton from "../../../../UI/LoadingButton/LoadingButton";
import useAuth from "../../../../hooks/useAuth";
import axios from "../../../../axios";
import Input from "../../../../components/Input/Input";
import { validate } from "../../../../helpers/validations";
import { objectToArrayWithId } from "../../../../helpers/objects";
import LoadingIcon from "../../../../UI/LoadingIcon/LoadingIcon";

export default function SetPermissions() {
    const [auth, setAuth] = useAuth();
    const [message, setMessage] = useState();
    const [form, setForm] = useState({
        userId: {
            value: "",
            error: "",
            showError: "",
            rules: ["required"],
        },
        permission: {
            value: "0",
            error: "",
            showError: "",
            rules: ["required"],
        },
    });

    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            user: form.userId.value,
            permission: form.permission.value
        }
        try {
            const search = await axios.get(`/permissions.json?auth=${auth.token}`);
            const userExist = objectToArrayWithId(search.data).filter(
                (perm) => perm.user === data.user
            );

            if (userExist.length !== 0) {
                await axios.patch(`/permissions/${userExist[0].id}.json?auth=${auth.token}`, data);
            } else {
                await axios.post(`/permissions.json?auth=${auth.token}`, data);
            }
            setMessage({ value: "Pomyślnie nadałeś uprawnienia", type: "alert-success" })

        } catch (ex) {
            setMessage({ value: ex.message, type: "alert-alert" })
        }
        setLoading(false);
    };

    const changeHandler = (value, fieldName) => {
        const error = validate(form[fieldName].rules, value);
        setForm({
            ...form,
            [fieldName]: {
                ...form[fieldName],
                value,
                showError: true,
                error: error,
            },
        });
    };


    return (loading ? (<LoadingIcon/>) : (<form onSubmit={submit}>
        {message && <div class={`alert ${message.type}`} role="alert">
            {message.value}
        </div>}


        <Input
            label="ID użytkownika"
            value={form.userId.value}
            onChange={(value) => changeHandler(value, "userId")}
            error={form.userId.error}
            showError={form.userId.showError}
        />

        <Input
            label="Uprawnienia"
            type="radio"
            name="method"
            value={form.permission.value}
            onChange={(value) => changeHandler(value, "permission")}
            options={[
                { value: "0", label: "Podstawowe" },
                { value: "1", label: "Pracownicze" },
                { value: "2", label: "Administracyjne" },
            ]}
            error={form.permission.error}
            showError={form.permission.showError}
        />

        <LoadingButton loading={loading} disabled={form.userId.value.length === 0} className="btn btn-success">
            Zapisz uprawnienia
        </LoadingButton>
    </form>));
}
