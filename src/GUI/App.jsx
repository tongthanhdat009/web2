import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./Components/UserLayout";
import AdminLayout from "./Components/AdminLayout";
import DangNhapAdmin from "./Pages/Admin/DangNhapAdmin";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/admin/dang-nhap-admin" element={<DangNhapAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
