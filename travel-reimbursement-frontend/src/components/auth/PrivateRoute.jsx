import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/" />; // Redirect to login if not logged in

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Not authorized
  }

  return children;
};

export default PrivateRoute;
