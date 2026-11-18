import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../css/Info.css";

// רשימת השדות להצגה: כותרת, ואיך מוציאים את הערך מהמשתמש
const INFO_FIELDS = [
  { label: "Full name", getValue: (user) => user.name },
  { label: "Username", getValue: (user) => user.username },
  { label: "Email", getValue: (user) => user.email },
  { label: "Phone", getValue: (user) => user.phone },
  { label: "Street", getValue: (user) => user.address?.street },
  { label: "City", getValue: (user) => user.address?.city },
  { label: "Company", getValue: (user) => user.company?.name },
  { label: "Website", getValue: (user) => user.website },
];

function Info() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) return null;

  // סגירה: חזרה לדף הבית (מ-/Bret/info ל-/Bret)
  function close() {
    navigate("..");
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Personal Info</h2>

        <table>
          <tbody>
            {INFO_FIELDS.map((field) => (
              <tr key={field.label}>
                <th>{field.label}</th>
                <td>{field.getValue(user) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={close}>Close</button>
      </div>
    </div>
  );
}

export default Info;