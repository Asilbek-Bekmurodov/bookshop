import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, initialized } = useSelector((s) => s.auth);

  if (!initialized) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/home" replace />;

  return children;
};

export default PrivateRoute;
