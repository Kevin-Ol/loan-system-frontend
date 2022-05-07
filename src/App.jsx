import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Loan from "./pages/Loan";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/client/register" element={<Register />} />
      <Route path="/loan/list" element={<Loan />} />
      <Route path="*" element={<Navigate to="/client/register" />} />
    </Routes>
  );
}

export default App;
