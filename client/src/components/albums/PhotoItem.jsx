import { useState } from "react";
import useForm from "../../hooks/useForm";
import "../../css/PhotoItem.css";

// photo    = התמונה להצגה
// onUpdate = עדכון (מקבל id ושינויים)
// onDelete = מחיקה (מקבל id)
function PhotoItem({ photo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const { values, handleChange, reset } = useForm({
    title: photo.title,
    url: photo.url,
  });

  // תמונה חלופית, אם הקישור המקורי לא עובד
  const fallbackUrl = "https://placehold.co/150x150/eeeeee/999999.png?text=No+image";
  function handleImageError(e) {
    if (e.target.src !== fallbackUrl) {
      e.target.src = fallbackUrl;
    }
  }

  function handleSave() {
    if (!values.title.trim() || !values.url.trim()) return;
    onUpdate(photo.id, {
      title: values.title,
      url: values.url,
      thumbnailUrl: values.url,
    });
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete photo "${photo.title}"?`)) {
      onDelete(photo.id);
    }
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  return (
    <div className="photo-item">
      <img src={photo.thumbnailUrl} alt={photo.title} onError={handleImageError} />

      {isEditing ? (
        <>
          <input aria-label="Photo title" name="title" value={values.title} onChange={handleChange} />
          <input aria-label="Image URL" name="url" value={values.url} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <p>
            #{photo.id} {photo.title}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}

export default PhotoItem;