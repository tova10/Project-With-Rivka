import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import useResource from "../../../hooks/useResource";
import AddForm from "../../common/AddForm";
import PhotoItem from "./PhotoItem";
import "../../../css/Photos.css";

const PAGE_SIZE = 10;

const ADD_FIELDS = [
  { name: "title", placeholder: "Photo title" },
  { name: "url", placeholder: "Image URL" },
];

function Photos() {

  const { user } = useContext(UserContext);
  const { username, albumId } = useParams();

  const { items: albums, loading: albumsLoading } = useResource("albums", `?userId=${user.id}`);
  const album = albums.find((item) => item.id === Number(albumId));

  const { items: photos, loading, error, addItem, updateItem, removeItem, loadMore, hasMore } =
    useResource("photos", `?albumId=${albumId}`, PAGE_SIZE);

  function handleAdd(values) {
    addItem({
      albumId: Number(albumId),
      title: values.title,
      url: values.url,
      thumbnailUrl: values.url,
    });
  }

  if (albumsLoading || loading) return <p>Loading...</p>;

  if (!album) {
    return (
      <div>
        <Link to={`/${username}/albums`}>← Back to albums</Link>
        <p>Album not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link to={`/${username}/albums`}>← Back to albums</Link>

      <h2>{album.title}</h2>

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} buttonText="Add photo" />

      {photos.length === 0 && <p>No photos in this album</p>}

      <div className="photos-grid">
        {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} onUpdate={updateItem} onDelete={removeItem} />
        ))}
      </div>

      {hasMore && <button onClick={loadMore}>Load more</button>}
    </div>
  );
}

export default Photos;
