import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Loan from "./pages/Loan";
import GeneralInfo from "./pages/GeneralInfo";
import Search from "./pages/Search";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/Auth";
import "./styles/App.scss";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="loan/list" element={<GeneralInfo />} />
          <Route path="loan/register" element={<Loan />} />
          <Route path="client/register" element={<Register />} />
          <Route path="client/search" element={<Search />} />
        </Route>
        <Route path="*" element={<Navigate to="/loan/register" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
