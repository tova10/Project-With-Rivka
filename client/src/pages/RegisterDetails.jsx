import { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { addData } from "../api/api";
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
  const { login } = useContext(UserContext);
  const { values, handleChange } = useForm({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    company: "",
  });
  const [error, setError] = useState("");

  // ה"חבילה" שהגיעה מהמסך הקודם: { username, password }
  const account = location.state;

  // מי שהגיע לכאן ישירות, בלי לעבור במסך הראשון, חוזר אליו
  if (!account) {
    return <Navigate to="/register" />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
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

    try {
      const saved = await addData("users", newUser);

      const { password, ...userWithoutPassword } = saved;
      login(userWithoutPassword);
      navigate(`/${saved.username}`);
    } catch (err) {
      setError(err.message);
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
        <button type="submit">Finish</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default RegisterDetails;