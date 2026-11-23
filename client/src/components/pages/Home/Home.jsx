import { useContext } from "react";
import { NavLink, useNavigate, useOutlet } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import "../../../css/Home.css";

function Home() {

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const outlet = useOutlet(); 

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div>
      <header>
        <h2>{user.name}</h2>

        <nav>
          <NavLink to="info">Info</NavLink>
          <NavLink to="todos">Todos</NavLink>
          <NavLink to="posts">Posts</NavLink>
          <NavLink to="albums">Albums</NavLink>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <main>
        {outlet || (
          <div className="home-intro">
            <p className="home-intro-label">Welcome, {user.username}</p>
            <h2>Choose a section from the menu</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
