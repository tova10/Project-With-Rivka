import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import useResource from "../hooks/useResource";

function Todos() {
  const { user } = useContext(UserContext);
  const { items: todos, loading, error } = useResource("todos", `?userId=${user?.id}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Todos ({todos.length})</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;