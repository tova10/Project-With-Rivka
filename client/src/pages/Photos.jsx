import { Link, useParams } from "react-router-dom";
import useResource from "../hooks/useResource";
import AddForm from "../components/common/AddForm";
import PhotoItem from "../components/albums/PhotoItem";
import "./Photos.css";

// כמה תמונות להביא בכל פעם
const PAGE_SIZE = 10;

// השדות בטופס ההוספה: לתמונה יש כותרת וקישור
const ADD_FIELDS = [
  { name: "title", placeholder: "Photo title" },
  { name: "url", placeholder: "Image URL" },
];

function Photos() {
  const { username, albumId } = useParams();
  const {
    items: photos,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    loadMore,
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Link to={`/${username}/albums`}>← Back to albums</Link>

      <h2>Album #{albumId}</h2>

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

      {hasMore && <button onClick={loadMore}>Load more</button>}
    </div>
  );
}

export default Photos;