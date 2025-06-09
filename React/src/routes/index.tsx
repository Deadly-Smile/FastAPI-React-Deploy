import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Home from "../features/introduction/Home";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}
