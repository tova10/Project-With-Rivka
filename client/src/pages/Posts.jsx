import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import useResource from "../hooks/useResource";
import { filterItems } from "../utils/listUtils";
import AddForm from "../components/common/AddForm";
import SearchBar from "../components/common/SearchBar";
import PostItem from "../components/posts/PostItem";
import "./Posts.css";

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

  // false = הפוסטים שלי, true = כל הפוסטים
  const [showAll, setShowAll] = useState(false);

  // הסינון שנשלח לשרת: לפי המצב
  const query = showAll ? "" : `?userId=${user?.id}`;

  const { items: posts, loading, error, addItem, updateItem, removeItem } =
    useResource("posts", query);

  const [search, setSearch] = useState({ field: "title", text: "" });

  // איזה פוסט פתוח (null = אף אחד)
  const [selectedPostId, setSelectedPostId] = useState(null);

  // מה מוצג: הרשימה אחרי חיפוש
  const visiblePosts = filterItems(posts, search);

  // משלימים פוסט חדש: userId של המחובר
  function handleAdd(values) {
    addItem({ userId: user.id, title: values.title, body: values.body });
  }

  // לחיצה על פוסט פתוח סוגרת אותו, ועל פוסט אחר פותחת אותו
  function handleSelect(postId) {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  }

  // מחיקה: אם הפוסט שנמחק היה פתוח, מנקים את הבחירה
  function handleDelete(postId) {
    removeItem(postId);
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{showAll ? "All Posts" : "My Posts"}</h2>

      <button onClick={() => setShowAll(!showAll)}>
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
            isSelected={post.id === selectedPostId}
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