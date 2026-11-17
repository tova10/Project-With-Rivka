import { useState } from "react";
import "./TodoItem.css";

// todo     = המשימה להצגה
// onUpdate = עדכון (מקבל id ושינויים)
// onDelete = מחיקה (מקבל id)
function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  function handleToggle() {
    onUpdate(todo.id, { completed: !todo.completed });
  }

  function handleSave() {
    if (!newTitle.trim()) return;
    onUpdate(todo.id, { title: newTitle });
    setIsEditing(false);
  }

  function handleCancel() {
    setNewTitle(todo.title);
    setIsEditing(false);
  }

  return (
    <li className="todo-item">
      <span>#{todo.id} </span>

      <input type="checkbox" checked={todo.completed} onChange={handleToggle} />

      {isEditing ? (
        <>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <span> {todo.title} </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </>
      )}
    </li>
  );
}

export default TodoItem;