import { useState } from "react";
import LoadingButton from "../../../UI/LoadingButton/LoadingButton";
import { validate } from "../../../helpers/validations";
import Input from "../../../components/Input/Input";
import axios from "../../../axios-auth";
import useAuth from "../../../hooks/useAuth";
import { useHistory } from "react-router-dom";

export default function Register(props) {
  const history = useHistory();
  const [auth, setAuth] = useAuth();
  const [error, setError] = useState();
  const [form, setForm] = useState({
    name: {
        value: "",
        error: "",
        showError: "",
        rules: ["required", { rule: "min", length: 3 }, { rule: "max", length: 12 }],
      },
    email: {
      value: "",
      error: "",
      showError: "",
      rules: ["required", "email", { rule: "max", length: 35 }],
    },
    password: {
      value: "",
      error: "",
      showError: "",
      rules: ["required", { rule: "min", length: 7 }, { rule: "max", length: 20 }],
    },
  });

  const valid = !Object.values(form)
    .map((input) => input.error)
    .filter((error) => error).length;

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "accounts:signUp",
        {
          email: form.email.value,
          password: form.password.value,
          displayName: form.name.value,
          returnSecureToken: true,
        }
      );
      setAuth({
        email: res.data.email,
        token: res.data.idToken,
        userId: res.data.localId,
        name: form.name.value,
      });
      history.push("/");
    } catch (ex) {
      if (ex.response.data.error.message === "EMAIL_EXISTS") {
        setError("Podany email jest w użyciu!");
      } else {
        setError(ex.response.data.error.message);
      }
      setLoading(false);
    }
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

  if (auth) {
    history.push("/");
  }

  return (
    <div className="card col-12 col-md-8 col-lg-5 d-flex flex-column p-0" style={{margin: "auto"}}>
      <h2 className="card-header">Rejestracja</h2>
      <div className="card-body">
        <p className="text-muted">Uzupełnij dane rejestracji</p>

        <form onSubmit={submit}>
          <Input
            label="Imię"
            type="text"
            value={form.name.value}
            onChange={(value) => changeHandler(value, "name")}
            error={form.name.error}
            showError={form.name.showError}
          />

          <Input
            label="Email"
            type="email"
            value={form.email.value}
            onChange={(value) => changeHandler(value, "email")}
            error={form.email.error}
            showError={form.email.showError}
          />

          <Input
            label="Hasło"
            type="password"
            value={form.password.value}
            onChange={(value) => changeHandler(value, "password")}
            error={form.password.error}
            showError={form.password.showError}
          />
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="text-right">
            <LoadingButton
              disabled={!valid}
              loading={loading}
              className="btn-success"
            >
              Zarejestruj!
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
