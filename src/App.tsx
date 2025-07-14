import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from '@/components/ui/sonner';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Todos } from './pages/Todos';
import { EmailConfirmation } from './pages/EmailConfirmation';
import { PrivateRoute } from './components/PrivateRoute';
import useAuthStore from './store/authStore';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <GoogleOAuthProvider clientId={"159565063412-71n0m1sgqjepoa2hnkcmfoos7agd8ejh.apps.googleusercontent.com"}>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? <Navigate to="/todos" replace /> : <Navigate to="/login" replace />
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm-email" element={<EmailConfirmation />} />
            <Route 
              path="/todos" 
              element={
                <PrivateRoute>
                  <Todos />
                </PrivateRoute>
              } 
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;