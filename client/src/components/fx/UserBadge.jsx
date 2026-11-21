import "../../css/UserBadge.css";

// ראשי תיבות מהשם המלא ("Leanne Graham" -> "LG")
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

// צבע קבוע לכל משתמש, לפי שם המשתמש
function getHue(text = "") {
  let sum = 0;
  for (const char of text) sum += char.charCodeAt(0);
  return (sum * 47) % 360;
}

function UserBadge({ name, username }) {
  return (
    <div className="user-badge">
      <span className="user-avatar" style={{ "--hue": getHue(username) }}>
        {getInitials(name)}
      </span>
      <div>
        <h1>{name}</h1>
        <p className="user-handle">@{username}</p>
      </div>
    </div>
  );
}

export default UserBadge;
