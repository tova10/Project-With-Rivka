import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Greeting from "../components/fx/Greeting";
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
        <Greeting name={user?.name} />

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