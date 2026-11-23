import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getData } from "../../../api/api";
import useFormFields from "../../../hooks/useFormFields";
import "../../../css/Register.css";

function Register() {

  const { values, handleChange } = useFormFields({
    username: "",
    password: "",
    verifyPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (values.password !== values.verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const users = await getData(`users?username=${encodeURIComponent(values.username)}`);

      if (users.length > 0) {
        setError("Username already exists");
        return;
      }

      navigate("/register/details", {
        state: { username: values.username, password: values.password },
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Register</h2>

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
        <input
          name="verifyPassword"
          type="password"
          placeholder="Verify password"
          aria-label="Verify password"
          value={values.verifyPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Next</button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
