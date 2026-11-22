import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import RegisterDetails from "./components/pages/RegisterDetails/RegisterDetails";
import Home from "./components/pages/Home/Home";
import Info from "./components/pages/Info/Info";
import Todos from "./components/pages/Todos/Todos";
import Posts from "./components/pages/Posts/Posts";
import Albums from "./components/pages/Albums/Albums";
import Photos from "./components/pages/Photos/Photos";
import NotFound from "./components/pages/NotFound/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* דף הכניסה בודק בעצמו אם כבר יש משתמש מחובר, ואם כן מעביר לעמוד היישום */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/details" element={<RegisterDetails />} />

      <Route
        path="/:username"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route path="info" element={<Info />} />
        <Route path="todos" element={<Todos />} />
        <Route path="posts" element={<Posts />} />
        <Route path="albums" element={<Albums />} />
        <Route path="albums/:albumId/photos" element={<Photos />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
