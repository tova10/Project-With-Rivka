import { Link } from "react-router-dom";
import "./AlbumItem.css";

// album    = האלבום להצגה
// onDelete = מחיקה (מקבל id)
function AlbumItem({ album, onDelete }) {
  return (
    <li className="album-item">
      <span>#{album.id} </span>
      <Link to={`${album.id}/photos`}>{album.title}</Link>
      <button onClick={() => onDelete(album.id)}>Delete</button>
    </li>
  );
}

export default AlbumItem;