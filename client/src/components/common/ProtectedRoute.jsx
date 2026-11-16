import { Outlet } from "react-router-dom";

// For now: lets everyone through. Will be filled in the protection stage.
function ProtectedRoute() {
  return <Outlet />;
}

export default ProtectedRoute;
