import { useState } from "react";
import useForm from "../../hooks/useForm";

// comment  = התגובה להצגה
// isOwner  = האם התגובה של המשתמש המחובר
// onUpdate = עדכון (מקבל id ושינויים)
// onDelete = מחיקה (מקבל id)
function CommentItem({ comment, isOwner, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const { values, handleChange, reset } = useForm({
    name: comment.name,
    body: comment.body,
  });

  function handleSave() {
    if (!values.name.trim() || !values.body.trim()) return;
    onUpdate(comment.id, { name: values.name, body: values.body });
    setIsEditing(false);
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  return (
    <li className="comment-item">
      {isEditing ? (
        <>
          <input name="name" value={values.name} onChange={handleChange} />
          <textarea name="body" value={values.body} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <strong>{comment.name}</strong>
          <small> by {comment.email}</small>
          <p>{comment.body}</p>
          {isOwner && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => onDelete(comment.id)}>Delete</button>
            </>
          )}
        </>
      )}
    </li>
  );
}

export default CommentItem;