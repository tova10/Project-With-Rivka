import { useState } from "react";
import { Link } from "react-router-dom";
import "../../../css/AlbumItem.css";

function AlbumItem({ album, onUpdate, onDelete }) {

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(album.title);

  function handleSave(e) {
    e.preventDefault();
    onUpdate(album.id, { title });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(album.title);
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete album "${album.title}" and its photos?`)) {
      onDelete(album.id);
    }
  }

  return (
    <li className="album-item">
      <span>#{album.id}</span>

      {isEditing ? (
        <form onSubmit={handleSave}>
          <input
            aria-label="Album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <Link to={`${album.id}/photos`}>{album.title}</Link>
          <button onClick={handleDelete}>Delete</button>
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      )}
    </li>
  );
}

export default AlbumItem;
