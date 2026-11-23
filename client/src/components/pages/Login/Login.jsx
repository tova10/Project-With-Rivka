import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getData } from "../../../api/api";
import { UserContext } from "../../../context/UserContext";
import useFormFields from "../../../hooks/useFormFields";
import "../../../css/Login.css";

function Login() {

  const { values, handleChange } = useFormFields({ username: "", password: "" });
  const [error, setError] = useState("");
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={`/${user.username}`} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const params = new URLSearchParams(values);
      const users = await getData(`users?${params}`);

      if (users.length === 0) {
        setError("Wrong username or password");
        return;
      }

      const loggedUser = users[0];
      delete loggedUser.password;
      login(loggedUser);
      navigate(`/${loggedUser.username}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          aria-label="Username"
          value={values.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          aria-label="Password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
