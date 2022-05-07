import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Loan from "./pages/Loan";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/Auth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="loan/register" element={<Loan />} />
          <Route path="client/register" element={<Register />} />
        </Route>
        <Route path="*" element={<Navigate to="/loan/register" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
