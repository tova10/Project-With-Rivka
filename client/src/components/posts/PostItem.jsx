import { useState } from "react";
import useForm from "../../hooks/useForm";
import "./PostItem.css";

// post       = הפוסט להצגה
// isSelected = האם הפוסט פתוח
// isOwner    = האם הפוסט שייך למשתמש המחובר
// onSelect   = פתיחה / סגירה
// onUpdate   = עדכון (מקבל id ושינויים)
// onDelete   = מחיקה (מקבל id)
function PostItem({ post, isSelected, isOwner, onSelect, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const { values, handleChange, reset } = useForm({
    title: post.title,
    body: post.body,
  });

  function handleSave() {
    if (!values.title.trim() || !values.body.trim()) return;
    onUpdate(post.id, { title: values.title, body: values.body });
    setIsEditing(false);
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  return (
    <li className={isSelected ? "post-item selected" : "post-item"}>
      <div>
        <span>#{post.id} </span>
        <span>{post.title} </span>
        <button onClick={() => onSelect(post.id)}>
          {isSelected ? "Close" : "Open"}
        </button>
      </div>

      {isSelected && (
        <div className="post-details">
          {isEditing ? (
            <>
              <input name="title" value={values.title} onChange={handleChange} />
              <textarea name="body" value={values.body} onChange={handleChange} />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <p>{post.body}</p>
              {isOwner && (
                <>
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                  <button onClick={() => onDelete(post.id)}>Delete</button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </li>
  );
}

export default PostItem;