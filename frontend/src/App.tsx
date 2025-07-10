import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { StoreProvider } from './providers/StoreProvider';
import AdminPage from './pages/AdminPage';
import WaiterPage from './pages/WaiterPage';
import PrivateRoute from './components/PrivateRoute';
import RoleRedirect from './components/RoleRedirect';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/waiter"
            element={
              <PrivateRoute role="waiter">
                <WaiterPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
