import { Navigate, Outlet, useLocation } from "react-router-dom";

import { isUserLoggedIn } from "../utils/session";

function ProtectedRoute() {
  const location = useLocation();

  if (!isUserLoggedIn()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;