import { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { addData } from "../../../api/api";
import { UserContext } from "../../../context/UserContext";
import useFormFields from "../../../hooks/useFormFields";
import "../../../css/RegisterDetails.css";

const FIELDS = [
  { name: "name", placeholder: "Full name", required: true },
  { name: "email", placeholder: "Email", type: "email", required: true },
  { name: "phone", placeholder: "Phone" },
  { name: "street", placeholder: "Street" },
  { name: "city", placeholder: "City" },
  { name: "company", placeholder: "Company" },
];

function RegisterDetails() {

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const { values, handleChange } = useFormFields({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    company: "",
  });
  const [error, setError] = useState("");

  const account = location.state;

  if (!account) {
    return <Navigate to="/register" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const savedUser = await addData("users", {
        username: account.username,
        password: account.password,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: { street: values.street, city: values.city },
        company: { name: values.company },
      });

      delete savedUser.password;
      login(savedUser);
      navigate(`/${savedUser.username}`, { replace: true });
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
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            aria-label={field.placeholder}
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
