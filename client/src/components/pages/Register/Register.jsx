import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getData } from "../../../api/api";
import { UserContext } from "../../../context/UserContext";
import useFormFields from "../../../hooks/useFormFields";
import "../../../css/Register.css";

// שמות שתפוסים על ידי עמודים ביישום, ולכן אסור לבחור בהם כשם משתמש
const RESERVED_NAMES = ["login", "register"];                        // ← חדש

// מותר: אותיות באנגלית ובעברית, ספרות, קו תחתון (_), נקודה (.) ומקף (-)
const VALID_USERNAME = /^[\w.\-א-ת]+$/;                              // ← חדש

function Register() {
  const { values, handleChange } = useFormFields({
    username: "",
    password: "",
    verifyPassword: "",
  });
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // כבר יש משתמש מחובר: עוברים ישר לעמוד היישום שלו
  // (הבדיקה נמצאת אחרי כל ה-hooks, כי אסור להפעיל hooks אחרי return)
  if (user) {
    return <Navigate to={`/${user.username}`} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // בדיקה 1: כל השדות מלאים
    if (!values.username || !values.password || !values.verifyPassword) {
      setError("Please fill in all fields");
      return;
    }

    // בדיקה 2: שם המשתמש תקין                                         // ← חדש
    const username = values.username.trim();                          // ← חדש

    if (!VALID_USERNAME.test(username)) {                             // ← חדש
      setError("Username may contain only letters, digits, _ . -");
      return;
    }

    if (RESERVED_NAMES.includes(username.toLowerCase())) {            // ← חדש
      setError("This username is not available");
      return;
    }

    // בדיקה 3: הסיסמאות זהות
    if (values.password !== values.verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // בדיקה 4: שם המשתמש פנוי בשרת
      // URLSearchParams מקודד תווים מיוחדים (& # + וכו') כדי שהכתובת לא תישבר
      const params = new URLSearchParams({ username });               // ← שונה: username במקום values.username
      const users = await getData(`users?${params}`);

      if (users.length > 0) {
        setError("Username already exists");
        return;
      }

      // הכול תקין: עוברים למסך השני, ומעבירים איתנו את שם המשתמש והסיסמה
      navigate("/register/details", {
        state: { username, password: values.password },               // ← שונה: username אחרי trim
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
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          aria-label="Password"
          value={values.password}
          onChange={handleChange}
        />
        <input
          name="verifyPassword"
          type="password"
          placeholder="Verify password"
          aria-label="Verify password"
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