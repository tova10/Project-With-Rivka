import { useState } from "react";
import useFormFields from "../../../hooks/useFormFields";
import "../../../css/PhotoItem.css";

function PhotoItem({ photo, onUpdate, onDelete }) {
  
  const [isEditing, setIsEditing] = useState(false);
  const { values, handleChange, reset } = useFormFields({ title: photo.title, url: photo.url });

  function handleSave() {
    if (!values.title.trim() || !values.url.trim()) return;
    onUpdate(photo.id, { title: values.title, url: values.url, thumbnailUrl: values.url });
    setIsEditing(false);
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete photo "${photo.title}"?`)) {
      onDelete(photo.id);
    }
  }

  return (
    <div className="photo-item">
      <img src={photo.url} alt={photo.title} />

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
