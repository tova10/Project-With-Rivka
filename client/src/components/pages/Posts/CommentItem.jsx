import { useState } from "react";
import useFormFields from "../../../hooks/useFormFields";

// comment  = התגובה להצגה
// isOwner  = האם התגובה של המשתמש המחובר
// onUpdate = עדכון (מקבל id ושינויים)
// onDelete = מחיקה (מקבל id)
function CommentItem({ comment, isOwner, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const { values, handleChange, reset } = useFormFields({
    name: comment.name,
    body: comment.body,
  });

  function handleSave() {
    if (!values.name.trim() || !values.body.trim()) return;
    onUpdate(comment.id, { name: values.name, body: values.body });
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm("Delete this comment?")) {
      onDelete(comment.id);
    }
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  return (
    <li className="comment-item">
      {isEditing ? (
        <>
          <input aria-label="Comment title" name="name" value={values.name} onChange={handleChange} />
          <textarea aria-label="Comment text" name="body" value={values.body} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <strong>{comment.name}</strong>
          {/* מי כתב: שם משתמש בלבד (לא מייל). תגובה בלי שם משתמש = אנונימית */}
          <small> by {comment.username || "Anonymous"}</small>
          <p>{comment.body}</p>
          {isOwner && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </>
      )}
    </li>
  );
}

export default CommentItem;
