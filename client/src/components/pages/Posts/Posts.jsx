import { useContext, useMemo } from "react";
import { UserContext } from "../../../context/UserContext";
import useResource from "../../../hooks/useResource";
import useUrlParams from "../../../hooks/useUrlParams";
import { filterItems, sortItems } from "../../../utils/listUtils";
import AddForm from "../../common/AddForm";
import SearchBar from "../../common/SearchBar";
import SortSelect from "../../common/SortSelect";
import PostItem from "./PostItem";
import "../../../css/Posts.css";

// לפי מה אפשר לחפש ולמיין
const FIELDS = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
];

const ADD_FIELDS = [
  { name: "title", placeholder: "Title" },
  { name: "body", placeholder: "Content" },
];

// הפוסטים: /Bret/posts (שלי) או /Bret/posts?all=true (של כולם)
function Posts() {
  const { user } = useContext(UserContext);

  // נשמר בכתובת: חיפוש, מיון, הכול/שלי, והפוסט הפתוח (?post=5)
  const [params, setParams] = useUrlParams({ by: "title", q: "", sort: "id", all: "", post: "" });
  const showAll = params.all === "true";

  const { items: posts, loading, error, addItem, updateItem, removeItem } =
    useResource("posts", showAll ? "" : `?userId=${user.id}`);

  // הרשימה המוצגת: קודם חיפוש, אחר כך מיון (useMemo - רק כשמשהו משתנה)
  const visiblePosts = useMemo(
    () => sortItems(filterItems(posts, params.by, params.q), params.sort),
    [posts, params.by, params.q, params.sort]
  );

  function handleAdd(values) {
    addItem({ userId: user.id, title: values.title, body: values.body });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{showAll ? "All Posts" : "My Posts"}</h2>

      <button onClick={() => setParams({ all: showAll ? "" : "true" })}>
        {showAll ? "Show my posts" : "Show all posts"}
      </button>

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} />

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
        Showing {visiblePosts.length} of {posts.length}
      </p>

      <ul>
        {visiblePosts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            isSelected={String(post.id) === params.post}
            isOwner={post.userId === user.id}
            onSelect={() => setParams({ post: String(post.id) })}
            onClose={() => setParams({ post: "" })}
            onUpdate={updateItem}
            onDelete={removeItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default Posts;
