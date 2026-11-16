import fs from "fs";
import path from "path";

// ---------- תבניות ----------

// רכיב React ריק (עם או בלי ייבוא של קובץ CSS)
function component(name, withCss) {
  const cssImport = withCss ? `import "./${name}.css";\n\n` : "";
  return `${cssImport}function ${name}() {
  return <div>${name}</div>;
}

export default ${name};
`;
}

// קובץ CSS ריק
function css(name) {
  return `/* ${name} styles */
`;
}

// ---------- רשימת הקבצים ----------

const files = {
  // ---- תקשורת עם השרת ----
  "src/api/api.js": `// All server requests live here
const BASE_URL = "http://localhost:3000";

export { BASE_URL };
`,

  // ---- כלי עזר ----
  "src/utils/storage.js": `// Save / read / remove the logged-in user in localStorage
const USER_KEY = "currentUser";

export { USER_KEY };
`,

  // ---- מידע משותף ----
  "src/context/UserContext.jsx": `import { createContext } from "react";

export const UserContext = createContext(null);

function UserProvider({ children }) {
  return (
    <UserContext.Provider value={null}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
`,

  // ---- קבצי CSS לדפים (הדפים עצמם כבר קיימים) ----
  "src/pages/Login.css": css("Login"),
  "src/pages/Register.css": css("Register"),
  "src/pages/RegisterDetails.css": css("RegisterDetails"),
  "src/pages/Home.css": css("Home"),
  "src/pages/Info.css": css("Info"),
  "src/pages/Todos.css": css("Todos"),
  "src/pages/Posts.css": css("Posts"),
  "src/pages/Albums.css": css("Albums"),
  "src/pages/Photos.css": css("Photos"),

  // ---- רכיבים משותפים ----
  "src/components/common/SearchBar.jsx": component("SearchBar", true),
  "src/components/common/SearchBar.css": css("SearchBar"),
  "src/components/common/ProtectedRoute.jsx": `import { Outlet } from "react-router-dom";

// For now: lets everyone through. Will be filled in the protection stage.
function ProtectedRoute() {
  return <Outlet />;
}

export default ProtectedRoute;
`,

  // ---- Todos ----
  "src/components/todos/TodoItem.jsx": component("TodoItem", true),
  "src/components/todos/TodoItem.css": css("TodoItem"),
  "src/components/todos/AddTodo.jsx": component("AddTodo", false),

  // ---- Posts ----
  "src/components/posts/PostItem.jsx": component("PostItem", true),
  "src/components/posts/PostItem.css": css("PostItem"),
  "src/components/posts/AddPost.jsx": component("AddPost", false),
  "src/components/posts/Comments.jsx": component("Comments", true),
  "src/components/posts/Comments.css": css("Comments"),
  "src/components/posts/CommentItem.jsx": component("CommentItem", false),
  "src/components/posts/AddComment.jsx": component("AddComment", false),

  // ---- Albums ----
  "src/components/albums/AlbumItem.jsx": component("AlbumItem", true),
  "src/components/albums/AlbumItem.css": css("AlbumItem"),
  "src/components/albums/AddAlbum.jsx": component("AddAlbum", false),
  "src/components/albums/PhotoItem.jsx": component("PhotoItem", true),
  "src/components/albums/PhotoItem.css": css("PhotoItem"),
  "src/components/albums/AddPhoto.jsx": component("AddPhoto", false),
};

// ---------- יצירה ----------

for (const [filePath, content] of Object.entries(files)) {
  // יוצרים את התיקייה של הקובץ אם היא לא קיימת
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // לא דורסים קבצים קיימים
  if (fs.existsSync(filePath)) {
    console.log(`skip (exists): ${filePath}`);
    continue;
  }

  fs.writeFileSync(filePath, content);
  console.log(`created: ${filePath}`);
}

console.log("Done!");