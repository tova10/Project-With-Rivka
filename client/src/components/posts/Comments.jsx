import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useResource from "../../hooks/useResource";
import AddForm from "../common/AddForm";
import CommentItem from "./CommentItem";
import "./Comments.css";

// השדות בטופס ההוספה: לתגובה יש כותרת (name) ותוכן (body)
const ADD_FIELDS = [
  { name: "name", placeholder: "Comment title" },
  { name: "body", placeholder: "Write a comment..." },
];

// postId = של איזה פוסט התגובות
function Comments({ postId }) {
  const { user } = useContext(UserContext);
  const { items: comments, loading, error, addItem, updateItem, removeItem } =
    useResource("comments", `?postId=${postId}`);

  // משלימים תגובה חדשה: לאיזה פוסט, ומי כתב (לפי email)
  function handleAdd(values) {
    addItem({
      postId: postId,
      name: values.name,
      email: user.email,
      body: values.body,
    });
  }

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="comments">
      <h4>Comments ({comments.length})</h4>

      {error && <p>Error: {error}</p>}

      <ul>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={comment.email === user.email}
            onUpdate={updateItem}
            onDelete={removeItem}
          />
        ))}
      </ul>

      <AddForm fields={ADD_FIELDS} onAdd={handleAdd} buttonText="Add comment" />
    </div>
  );
}

export default Comments;