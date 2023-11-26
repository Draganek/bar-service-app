import { useEffect, useState } from "react";
import LoadingButton from "../../../UI/LoadingButton/LoadingButton";
import { validateEmail } from "../../../helpers/validations";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../axios-auth";
import ToastMessage from "../../../components/ToastMessage/ToastMessage";

export default function ProfileDetails() {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState(auth.name);
  const [email, setEmail] = useState(auth.email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [submitInfo, setsubmitInfo] = useState(null);
  const buttonDisabled = Object.values(errors).filter((x) => x).length;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        idToken: auth.token,
        displayName: name,
        returnSecureToken: true,
      };
      if (password) {
        data.password = password;
      }

      const res = await axios.post(`accounts:update`, data);

      setAuth({
        email: res.data.email,
        token: res.data.idToken,
        userId: res.data.localId,
        name: res.data.displayName,

      });
      setLoading(false);
      setsubmitInfo("Wow udało się");
      setMsg("success");
    } catch (ex) {
      if (ex.response.status === 400) {
        handleToggleToast();
      } else {
        setsubmitInfo("No i się wyjebało");
        setMsg("danger");
      }
      setLoading(false);

    }
  };

  useEffect(() => {
    if (validateEmail(email)) {
      setErrors({ ...errors, email: "" });
    } else {
      setErrors({ ...errors, email: "Niepoprawny email" });
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 4 || !password) {
      setErrors({ ...errors, password: "" });
    } else {
      setErrors({ ...errors, password: "Wymagane 4 znaki" });
    }
  }, [password]);

  const handleToggleToast = () => {
    setToastActive(!toastActive);
  };

  return (
    <form onSubmit={submit}>
      {submitInfo ? (
        <div className={`alert alert-${msg}`}>{submitInfo}</div>
      ) : null}
      <div className="form-group">
        <label>Imię</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`form-control`}
        />
        <div className="valid-feedback">Wszystko gra!</div>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          disabled
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-control ${errors.email ? "is-invalid" : "is-valid"}`}
        />
        <div className="invalid-feedback">{errors.email}</div>
        <div className="valid-feedback">Wszystko gra!</div>
      </div>
      <div className="form-group">
        <label>Hasło</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.password}</div>
      </div>

      <div className="d-flex align-items-stretch">
        <LoadingButton loading={loading} disabled={buttonDisabled} style={{ height: '2.5rem' }}>
          Zapisz
        </LoadingButton>
        <div className="flex-grow-1">
          {toastActive && (
            <ToastMessage isActive={toastActive} onToggle={handleToggleToast} />
          )}
        </div>
      </div>
    </form>
  );
}
