import { useState } from "react";
import "../../../css/TodoItem.css";

// משימה אחת: מזהה, checkbox של ביצוע, כותרת, עריכה ומחיקה
function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  function handleSave() {
    if (!title.trim()) return;
    onUpdate(todo.id, { title });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(todo.title);
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete todo "${todo.title}"?`)) {
      onDelete(todo.id);
    }
  }

  return (
    <li className="todo-item">
      <span>#{todo.id}</span>

      <input
        type="checkbox"
        aria-label="Done"
        checked={todo.completed}
        onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
      />

      {isEditing ? (
        <>
          <input aria-label="Todo title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <span>{todo.title}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </li>
  );
}

export default TodoItem;
