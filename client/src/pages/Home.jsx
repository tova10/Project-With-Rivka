import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../css/Home.css";

function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

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
        <Outlet />
      </main>
    </div>
  );
}

export default Home;