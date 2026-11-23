import { useContext, useMemo } from "react";
import { UserContext } from "../../../context/UserContext";
import useResource from "../../../hooks/useResource";
import useUrlParams from "../../../hooks/useUrlParams";
import { filterItems, sortItems } from "../../../utils/listUtils";
import AddForm from "../../common/AddForm";
import SearchBar from "../../common/SearchBar";
import SortSelect from "../../common/SortSelect";
import AlbumItem from "./AlbumItem";
import "../../../css/Albums.css";

const FIELDS = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
];

const ADD_FIELDS = [{ name: "title", placeholder: "New album title..." }];

function Albums() {

  const { user } = useContext(UserContext);
  const { items: albums, loading, error, addItem, updateItem, removeItem } =
    useResource("albums", `?userId=${user.id}`);

  const [params, setParams] = useUrlParams({ by: "title", q: "", sort: "id" });

  const visibleAlbums = useMemo(
    () => sortItems(filterItems(albums, params.by, params.q), params.sort),
    [albums, params.by, params.q, params.sort]
  );

  function handleAdd(values) {
    addItem({ userId: user.id, title: values.title });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Albums</h2>

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} buttonText="Create album" />

      <SearchBar
        fields={FIELDS}
        field={params.by}
        text={params.q}
        onChange={(by, q) => setParams({ by, q })}
      />
      <SortSelect
        options={FIELDS}
        value={params.sort}
        onChange={(sort) => setParams({ sort })}
      />

      <p className="list-count">
        Showing {visibleAlbums.length} of {albums.length}
      </p>

      <ul>
        {visibleAlbums.map((album) => (
          <AlbumItem key={album.id} album={album} onUpdate={updateItem} onDelete={removeItem} />
        ))}
      </ul>
    </div>
  );
}

export default Albums;
