import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import "../../../css/Info.css";

function Info() {

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const rows = [
    { label: "Full name", value: user.name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Street", value: user.address.street },
    { label: "City", value: user.address.city },
    { label: "Company", value: user.company.name },
    { label: "Website", value: user.website },
  ];

  function close() {
    navigate(`/${user.username}`);
  }

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Personal Info</h2>

        <table>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                <td>{row.value || "-"}</td>
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
