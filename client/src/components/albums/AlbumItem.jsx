import { Link } from "react-router-dom";
import "../../css/AlbumItem.css";

// album    = האלבום להצגה
// onDelete = מחיקה (מקבל id)
function AlbumItem({ album, onDelete }) {
  // מחיקת אלבום מוחקת בשרת גם את כל התמונות שבו
  function handleDelete() {
    if (window.confirm(`Delete album "${album.title}" and all its photos?`)) {
      onDelete(album.id);
    }
  }

  return (
    <li className="album-item">
      <span>#{album.id} </span>
      <Link to={`${album.id}/photos`}>{album.title}</Link>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default AlbumItem;