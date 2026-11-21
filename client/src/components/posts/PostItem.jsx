import { useState } from "react";
import useForm from "../../hooks/useForm";
import Comments from "./Comments";
import "../../css/PostItem.css";

// post       = הפוסט להצגה
// isSelected = האם הפוסט פתוח
// isOwner    = האם הפוסט שייך למשתמש המחובר
// onSelect   = פתיחה / סגירה
// onUpdate   = עדכון (מקבל id ושינויים)
// onDelete   = מחיקה (מקבל id)
function PostItem({ post, isSelected, isOwner, onSelect, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { values, handleChange, reset } = useForm({
    title: post.title,
    body: post.body,
  });

  // לחיצה על כפתור הכותרת: פותחת את הפוסט (רק אם הוא סגור)
  function handleOpen() {
    if (!isSelected) {
      onSelect(post.id);
    }
  }

  // לחיצה על X: סוגרת את הפוסט
  function handleClose() {
    onSelect(post.id);
  }

  function handleSave() {
    if (!values.title.trim() || !values.body.trim()) return;
    onUpdate(post.id, { title: values.title, body: values.body });
    setIsEditing(false);
  }

  // מחיקת פוסט מוחקת בשרת גם את כל התגובות שלו
  function handleDelete() {
    if (window.confirm(`Delete post "${post.title}" and all its comments?`)) {
      onDelete(post.id);
    }
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  return (
    <li className={isSelected ? "post-item selected" : "post-item"}>
      <div className="post-header">
        {/* כפתור לבחירת הפוסט (לפי הדרישות) */}
        <button className="post-title-button" onClick={handleOpen}>
          #{post.id} {post.title}
        </button>

        {isSelected && (
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        )}
      </div>

      {isSelected && (
        <div className="post-details">
          {isEditing ? (
            <>
              <input aria-label="Post title" name="title" value={values.title} onChange={handleChange} />
              <textarea aria-label="Post content" name="body" value={values.body} onChange={handleChange} />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <p>{post.body}</p>
              {isOwner && (
                <>
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </>
              )}
              <button onClick={() => setShowComments(!showComments)}>
                {showComments ? "Hide comments" : "Show comments"}
              </button>
            </>
          )}

          {showComments && <Comments postId={post.id} />}
        </div>
      )}
    </li>
  );
}

export default PostItem;
