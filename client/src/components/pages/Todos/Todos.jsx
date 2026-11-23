import { useContext, useMemo } from "react";
import { UserContext } from "../../../context/UserContext";
import useResource from "../../../hooks/useResource";
import useUrlParams from "../../../hooks/useUrlParams";
import { filterItems, sortItems } from "../../../utils/listUtils";
import AddForm from "../../common/AddForm";
import SearchBar from "../../common/SearchBar";
import SortSelect from "../../common/SortSelect";
import TodoItem from "./TodoItem";
import "../../../css/Todos.css";

// לפי מה אפשר לחפש ולמיין
const FIELDS = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
  { value: "completed", label: "Status" },
];

const ADD_FIELDS = [{ name: "title", placeholder: "New todo..." }];

// המשימות של המשתמש: /Bret/todos
function Todos() {
  const { user } = useContext(UserContext);
  const { items: todos, loading, error, addItem, updateItem, removeItem } =
    useResource("todos", `?userId=${user.id}`);

  // החיפוש והמיון נשמרים בכתובת: ?by=title&q=abc&sort=title
  const [params, setParams] = useUrlParams({ by: "title", q: "", sort: "id" });

  // הרשימה המוצגת: קודם חיפוש, אחר כך מיון.
  // useMemo - מחושבת מחדש רק כשמשהו מהם משתנה
  const visibleTodos = useMemo(
    () => sortItems(filterItems(todos, params.by, params.q), params.sort),
    [todos, params.by, params.q, params.sort]
  );

  function handleAdd(values) {
    addItem({ userId: user.id, title: values.title, completed: false });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Todos</h2>

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} />

      <SearchBar
        fields={FIELDS}
        field={params.by}
        text={params.q}
        onChange={(by, q) => setParams({ by, q })}
      />
      <SortSelect
        options={FIELDS}
        value={params.sort}
        onChange={(sort) => setParams({ sort })}
      />

      <p className="list-count">
        Showing {visibleTodos.length} of {todos.length}
      </p>

      <ul>
        {visibleTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onUpdate={updateItem} onDelete={removeItem} />
        ))}
      </ul>
    </div>
  );
}

export default Todos;
