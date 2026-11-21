import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import useResource from "../hooks/useResource";
import { useUrlState, useUrlSearch } from "../hooks/useUrlState";
import { filterItems, sortItems } from "../utils/listUtils";
import AddForm from "../components/common/AddForm";
import SearchBar from "../components/common/SearchBar";
import TodoItem from "../components/todos/TodoItem";
import TodoProgress from "../components/fx/TodoProgress";
import "../css/Todos.css";

// השדות בטופס ההוספה
const ADD_FIELDS = [{ name: "title", placeholder: "New todo..." }];

// על מה אפשר לחפש
const SEARCH_FIELDS = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
  { value: "completed", label: "Status" },
];

// לפי מה אפשר למיין
const SORT_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
  { value: "completed", label: "Status" },
];

function Todos() {
  const { user } = useContext(UserContext);
  const { items: todos, loading, error, addItem, updateItem, removeItem } =
    useResource("todos", `?userId=${user?.id}`);

  // החיפוש והמיון נשמרים בכתובת (נשארים אחרי ריענון)
  const [search, setSearch] = useUrlSearch(
    "title",
    SEARCH_FIELDS.map((field) => field.value)
  );
  const [sortBy, setSortBy] = useUrlState(
    "sort",
    "id",
    SORT_OPTIONS.map((option) => option.value)
  );

  // מה מוצג: קודם מסננים, אחר כך ממיינים
  const visibleTodos = sortItems(filterItems(todos, search), sortBy);

  // משלימים משימה חדשה: userId של המחובר, ו-completed: false
  function handleAdd(values) {
    addItem({ userId: user.id, title: values.title, completed: false });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Todos</h2>

      <TodoProgress todos={todos} />

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} />

      <SearchBar fields={SEARCH_FIELDS} search={search} onChange={setSearch} />

      <div>
        <label>Sort by: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p>Showing {visibleTodos.length} of {todos.length}</p>

      <ul>
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={updateItem}
            onDelete={removeItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default Todos;