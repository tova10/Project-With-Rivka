import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getData } from "../api/api";
import useForm from "../hooks/useForm";
import "./Register.css";

function Register() {
  const { values, handleChange } = useForm({
    username: "",
    password: "",
    verifyPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // בדיקה 1: כל השדות מלאים
    if (!values.username || !values.password || !values.verifyPassword) {
      setError("Please fill in all fields");
      return;
    }

    // בדיקה 2: הסיסמאות זהות
    if (values.password !== values.verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // בדיקה 3: שם המשתמש פנוי בשרת
      const users = await getData(`users?username=${values.username}`);

      if (users.length > 0) {
        setError("Username already exists");
        return;
      }

      // הכול תקין: עוברים למסך השני, ומעבירים איתנו את שם המשתמש והסיסמה
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
        <input
          name="verifyPassword"
          type="password"
          placeholder="Verify password"
          value={values.verifyPassword}
          onChange={handleChange}
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