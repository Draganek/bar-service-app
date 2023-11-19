import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useHistory } from "react-router-dom";
import LoadingButton from "../../../UI/LoadingButton/LoadingButton";
import axios from "../../../axios-auth";

export default function Login(props) {
  const [auth, setAuth] = useAuth();
  const history = useHistory();
  const [error, setError] = useState();

  const [email, setEmail] = useState("thedragonplgaming@gmail.com");
  const [password, setPassword] = useState("tajne123");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("accounts:signInWithPassword", {
        email,
        password,
        returnSecureToken: true,
      });
      setAuth({
        email: res.data.email,
        token: res.data.idToken,
        userId: res.data.localId,
        name: res.data.displayName
      });
      history.push("/");
    } catch (ex) {
      setError(ex.response.data.error.message);
      setLoading(false);
    }
  };

  if (auth) {
    history.push("/");
  }

  return (
    <div className="card">
      <h2 className="card-header">Logowanie</h2>
      <div className="card-body">
      <p className="text-muted">Uzupełnij dane logowania</p>
        {valid === false ? (
          <div className="alert alert-danger">Niepoprawne dane logowania</div>
        ) : null}
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <LoadingButton loading={loading}>Zaloguj</LoadingButton>
        </form>
      </div>
    </div>
  );
}
