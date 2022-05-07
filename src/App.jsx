import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Loan from "./pages/Loan";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/Auth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="client/register" element={<Register />} />
          <Route path="loan/list" element={<Loan />} />
        </Route>
        <Route path="*" element={<Navigate to="/client/register" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
