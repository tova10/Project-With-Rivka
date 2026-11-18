import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
        <h1>Welcome, {user?.name}</h1>

        <nav>
          <Link to="info">Info</Link> |{" "}
          <Link to="todos">Todos</Link> |{" "}
          <Link to="posts">Posts</Link> |{" "}
          <Link to="albums">Albums</Link> |{" "}
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