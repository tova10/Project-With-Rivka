import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import useResource from "../hooks/useResource";
import { useUrlSearch } from "../hooks/useUrlState";
import { filterItems } from "../utils/listUtils";
import AddForm from "../components/common/AddForm";
import SearchBar from "../components/common/SearchBar";
import AlbumItem from "../components/albums/AlbumItem";
import "../css/Albums.css";

// השדות בטופס ההוספה: לאלבום יש רק כותרת
const ADD_FIELDS = [{ name: "title", placeholder: "New album title..." }];

// על מה אפשר לחפש (לפי הדרישות: id וכותרת)
const SEARCH_FIELDS = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
];

function Albums() {
  const { user } = useContext(UserContext);
  const { items: albums, loading, error, addItem, removeItem } =
    useResource("albums", `?userId=${user?.id}`);

  // החיפוש נשמר בכתובת (נשאר אחרי ריענון)
  const [search, setSearch] = useUrlSearch("title");

  // מה מוצג: הרשימה אחרי חיפוש
  const visibleAlbums = filterItems(albums, search);

  // משלימים אלבום חדש: userId של המחובר
  function handleAdd(values) {
    addItem({ userId: user.id, title: values.title });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Albums</h2>

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} buttonText="Create album" />

      <SearchBar fields={SEARCH_FIELDS} search={search} onChange={setSearch} />

      <p>Showing {visibleAlbums.length} of {albums.length}</p>

      <ul>
        {visibleAlbums.map((album) => (
          <AlbumItem key={album.id} album={album} onDelete={removeItem} />
        ))}
      </ul>
    </div>
  );
}

export default Albums;