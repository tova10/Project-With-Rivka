import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import useResource from "../../../hooks/useResource";
import { useUrlState, useUrlSearch } from "../../../hooks/useUrlState";
import { filterItems } from "../../../utils/listUtils";
import AddForm from "../../common/AddForm";
import SearchBar from "../../common/SearchBar";
import PostItem from "./PostItem";
import "../../../css/Posts.css";

// השדות בטופס ההוספה: לפוסט יש כותרת ותוכן
const ADD_FIELDS = [
  { name: "title", placeholder: "Title" },
  { name: "body", placeholder: "Content" },
];

// על מה אפשר לחפש (לפי הדרישות: id וכותרת)
const SEARCH_FIELDS = [
  { value: "id", label: "ID" },
  { value: "title", label: "Title" },
];

function Posts() {
  const { user } = useContext(UserContext);

  // הפוסטים שלי / כל הפוסטים (נשמר בכתובת: ?all=true)
  const [all, setAll] = useUrlState("all");
  const showAll = all === "true";

  // הסינון שנשלח לשרת: לפי המצב
  const query = showAll ? "" : `?userId=${user?.id}`;

  const { items: posts, loading, error, addItem, updateItem, removeItem } =
    useResource("posts", query);

  // החיפוש נשמר בכתובת (נשאר אחרי ריענון)
   const [search, setSearch] = useUrlSearch(
    "title",
    SEARCH_FIELDS.map((field) => field.value)
  );
  // איזה פוסט פתוח ("" = אף אחד), נשמר בכתובת: ?post=5
  const [selected, setSelected] = useUrlState("post");

  // מה מוצג: הרשימה אחרי חיפוש
  const visiblePosts = filterItems(posts, search);

  // משלימים פוסט חדש: userId של המחובר
  function handleAdd(values) {
    addItem({ userId: user.id, title: values.title, body: values.body });
  }

  // לחיצה על פוסט פתוח סוגרת אותו, ועל פוסט אחר פותחת אותו
  function handleSelect(postId) {
    setSelected(String(postId) === selected ? "" : String(postId));
  }

  // מחיקה: אם הפוסט שנמחק היה פתוח, מנקים את הבחירה
  function handleDelete(postId) {
    removeItem(postId);
    if (String(postId) === selected) {
      setSelected("");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{showAll ? "All Posts" : "My Posts"}</h2>

      <button onClick={() => setAll(showAll ? "" : "true")}>
        {showAll ? "Show my posts" : "Show all posts"}
      </button>

      {error && <p>Error: {error}</p>}

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} />

      <SearchBar fields={SEARCH_FIELDS} search={search} onChange={setSearch} />

      <p>Showing {visiblePosts.length} of {posts.length}</p>

      <ul>
        {visiblePosts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            isSelected={String(post.id) === selected}
            isOwner={post.userId === user.id}
            onSelect={handleSelect}
            onUpdate={updateItem}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}

export default Posts;