import { useState } from "react";
import useFormFields from "../../../hooks/useFormFields";
import Comments from "./Comments";
import "../../../css/PostItem.css";

function PostItem({ post, isSelected, isOwner, onSelect, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { values, handleChange, reset } = useFormFields({ title: post.title, body: post.body });

  function handleSave() {
    if (!values.title.trim() || !values.body.trim()) return;
    onUpdate(post.id, { title: values.title, body: values.body });
    setIsEditing(false);
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete post "${post.title}" and its comments?`)) {
      onDelete(post.id);
    }
  }

  return (
    <li className={isSelected ? "post-item selected" : "post-item"}>
      <div className="post-header">
        <button className="post-title-button" onClick={onSelect}>
          #{post.id} {post.title}
        </button>

        {isSelected && (
          <button className="close-button" aria-label="Close" onClick={onClose}>
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
