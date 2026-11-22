import { useContext } from "react";
import { Link, NavLink, Outlet, useNavigate, useOutlet } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import "../../../css/Home.css";

// הכרטיסים שמוצגים באזור הריק, כשעוד לא נבחר מדור
const SECTIONS = [
  { to: "info", title: "Info", text: "Your personal details" },
  { to: "todos", title: "Todos", text: "Tasks to do and done" },
  { to: "posts", title: "Posts", text: "Posts and comments" },
  { to: "albums", title: "Albums", text: "Photos and albums" },
];

function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  // יש תוכן רק כשנבחר מדור (info / todos / posts / albums)
  const outlet = useOutlet();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div>
      <header>
        <h2>Welcome, {user.username}</h2>

        <nav>
          <NavLink to="info">Info</NavLink> |{" "}
          <NavLink to="todos">Todos</NavLink> |{" "}
          <NavLink to="posts">Posts</NavLink> |{" "}
          <NavLink to="albums">Albums</NavLink> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <main>
        {outlet ? (
          <Outlet />
        ) : (
          <div className="home-intro">
            <p className="home-intro-label">Personal workspace</p>
            <h2>
              My Task
              <br />
              Management
              <br />
              System
            </h2>
            <p className="home-intro-text">
              Everything in one place: plan your todos, write posts and keep
              your albums organized.
            </p>

            <div className="home-intro-links">
              {SECTIONS.map((section, index) => (
                <Link key={section.to} to={section.to} className="home-link">
                  <span className="home-link-num">0{index + 1}</span>
                  <span className="home-link-title">{section.title}</span>
                  <span className="home-link-text">{section.text}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
