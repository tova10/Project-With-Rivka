import { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { addData, getData } from "../api/api";                    // ← נוסף getData
import { UserContext } from "../context/UserContext";
import useForm from "../hooks/useForm";
import "../css/RegisterDetails.css";

// רשימת השדות בטופס: כדי לא לכתוב 6 שדות input אחד אחד
const FIELDS = [
  { name: "name", placeholder: "Full name" },
  { name: "email", placeholder: "Email" },
  { name: "phone", placeholder: "Phone" },
  { name: "street", placeholder: "Street" },
  { name: "city", placeholder: "City" },
  { name: "company", placeholder: "Company" },
];

function RegisterDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useContext(UserContext);                 // ← נוסף user
  const { values, handleChange } = useForm({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    company: "",
  });
  const [error, setError] = useState("");

  // האם השליחה לשרת באמצע (כדי למנוע לחיצה כפולה)
  const [submitting, setSubmitting] = useState(false);             // ← חדש

  // ה"חבילה" שהגיעה מהמסך הקודם: { username, password }
  const account = location.state;

  // (הבדיקות נמצאות אחרי כל ה-hooks, כי אסור להפעיל hooks אחרי return)

  // משתמש שכבר מחובר (למשל חזר לכאן בכפתור "אחורה"): לעמוד היישום שלו
  if (user) {                                                      // ← חדש
    return <Navigate to={`/${user.username}`} replace />;
  }

  // מי שהגיע לכאן ישירות, בלי לעבור במסך הראשון, חוזר אליו
  // replace = כדי שכפתור "אחורה" לא יחזיר לכאן ויפנה שוב קדימה
  if (!account) {
    return <Navigate to="/register" replace />;                    // ← נוסף replace
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // כבר שולחים: מתעלמים מלחיצה נוספת
    if (submitting) return;                                        // ← חדש

    setError("");

    if (!values.name || !values.email) {
      setError("Name and email are required");
      return;
    }

    if (!values.email.includes("@")) {
      setError("Invalid email");
      return;
    }

    // בונים משתמש חדש באותו מבנה כמו המשתמשים הקיימים בשרת
    const newUser = {
      username: account.username,
      password: account.password,
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: { street: values.street, city: values.city },
      company: { name: values.company },
    };

    setSubmitting(true);                                           // ← חדש

    try {
      // בדיקה חוזרת: אולי מישהו אחר תפס את השם בזמן שמילאנו פרטים
      const params = new URLSearchParams({ username: account.username });   // ← חדש
      const existing = await getData(`users?${params}`);                     // ← חדש

      if (existing.length > 0) {                                   // ← חדש
        setError("Username already exists");
        setSubmitting(false);
        return;
      }

      const saved = await addData("users", newUser);

      // שומרים את המשתמש בלי הסיסמה
      const userWithoutPassword = { ...saved };                    // ← שונה (lint 4)
      delete userWithoutPassword.password;                         // ← שונה (lint 4)

      login(userWithoutPassword);

      // replace = מוחקים את מסך ההרשמה מההיסטוריה, כדי שאי אפשר לחזור אליו
      navigate(`/${saved.username}`, { replace: true });           // ← נוסף replace
    } catch (err) {
      setError(err.message);
      setSubmitting(false);                                        // ← חדש
    }
  }

  return (
    <div>
      <h2>Complete Your Details</h2>
      <p>Hello {account.username}, please fill in your details:</p>

      <form onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={handleChange}
          />
        ))}
        <button type="submit" disabled={submitting}>               {/* ← נוסף disabled */}
          {submitting ? "Saving..." : "Finish"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default RegisterDetails;