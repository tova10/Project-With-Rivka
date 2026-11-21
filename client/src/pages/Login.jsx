import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getData } from "../api/api";
import { UserContext } from "../context/UserContext";
import useForm from "../hooks/useForm";
import "../css/Login.css";

function Login() {
  const { values, handleChange } = useForm({ username: "", password: "" });
  const [error, setError] = useState("");
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();

  // כבר יש משתמש שמור (ב-LS): עוברים ישר לעמוד היישום שלו
  // (הבדיקה נמצאת אחרי כל ה-hooks, כי אסור להפעיל hooks אחרי return)
  if (user) {
    return <Navigate to={`/${user.username}`} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!values.username || !values.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const params = new URLSearchParams({
        username: values.username,
        password: values.password,
      });
      const users = await getData(`users?${params}`);

      if (users.length === 0) {
        setError("Wrong username or password");
        return;
      }

      const userWithoutPassword = { ...users[0] };
      delete userWithoutPassword.password;

      login(userWithoutPassword);
      navigate(`/${userWithoutPassword.username}`);
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
          value={values.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
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
