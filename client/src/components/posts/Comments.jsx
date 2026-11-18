import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useResource from "../../hooks/useResource";
import AddForm from "../common/AddForm";
import CommentItem from "./CommentItem";
import "../../css/Comments.css";

// השדות בטופס ההוספה: כותרת (name), תוכן (body), ואפשרות לכתוב כאנונימי
const ADD_FIELDS = [
  { name: "name", placeholder: "Comment title" },
  { name: "body", placeholder: "Write a comment..." },
  { name: "anonymous", type: "checkbox", label: "Post anonymously" },
];

// postId = של איזה פוסט התגובות
function Comments({ postId }) {
  const { user } = useContext(UserContext);
  const { items: comments, loading, error, addItem, updateItem, removeItem } =
    useResource("comments", `?postId=${postId}`);

  // משלימים תגובה חדשה: לאיזה פוסט ומי כתב
  // userId נשמר תמיד (כדי שהכותב יוכל לערוך ולמחוק), אבל לא מוצג
  // username נשמר רק אם הכותב לא בחר אנונימי
  // לא שומרים מייל בתגובה, כדי שלא ייחשף למשתמשים אחרים
  function handleAdd(values) {
    const newComment = {
      postId: postId,
      userId: user.id,
      name: values.name,
      body: values.body,
    };

    if (!values.anonymous) {
      newComment.username = user.username;
    }

    addItem(newComment);
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
            isOwner={comment.userId === user.id}
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
