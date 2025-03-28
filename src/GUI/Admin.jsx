import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Components/Header";
import AdminLayout from "./Components/AdminLayout";

const Admin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const user = {
    name: "Admin User",
    avatar: "/assets/avatar/0.png",
  };

  return (
    <Router>
      <Header user={user} toggleMenu={toggleMenu} />
      <AdminLayout isMenuOpen={isMenuOpen} />
    </Router>
  );
};

export default Admin;
