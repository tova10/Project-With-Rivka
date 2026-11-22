import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import useResource from "../../../hooks/useResource";
import AddForm from "../../common/AddForm";
import PhotoItem from "./PhotoItem";
import "../../../css/Photos.css";

// כמה תמונות להביא בכל פעם
const PAGE_SIZE = 10;

// השדות בטופס ההוספה: לתמונה יש כותרת וקישור
const ADD_FIELDS = [
  { name: "title", placeholder: "Photo title" },
  { name: "url", placeholder: "Image URL" },
];

function Photos() {
  const { user } = useContext(UserContext);
  const { username, albumId } = useParams();

  // בדיקה: האם האלבום הזה שייך למשתמש המחובר?
  const { items: myAlbum, loading: albumLoading } = useResource(
    "albums",
    `?id=${albumId}&userId=${user?.id}`
  );

  const {
    items: photos,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    loadMore,
    loadingMore,                                          // ← חדש (באג 6)
    hasMore,
  } = useResource("photos", `?albumId=${albumId}`, PAGE_SIZE);

  // משלימים תמונה חדשה: לאיזה אלבום היא שייכת
  function handleAdd(values) {
    addItem({
      albumId: Number(albumId),
      title: values.title,
      url: values.url,
      thumbnailUrl: values.url,
    });
  }

  if (loading || albumLoading) return <p>Loading...</p>;

  // האלבום לא שייך למשתמש (או לא קיים)
  if (myAlbum.length === 0) {
    return (
      <div>
        <p>Album not found.</p>
        <Link to={`/${username}/albums`}>← Back to albums</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to={`/${username}/albums`}>← Back to albums</Link>

      <h2>{myAlbum[0].title}</h2>

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} buttonText="Add photo" />

      {photos.length === 0 && <p>No photos in this album</p>}

      <div className="photos-grid">
        {photos.map((photo) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            onUpdate={updateItem}
            onDelete={removeItem}
          />
        ))}
      </div>

      {/* בזמן טעינה: הכפתור מושבת ומציג "Loading..." */}   {/* ← שונה (באג 6) */}
      {hasMore && (
        <button onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}

export default Photos;