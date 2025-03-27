import React, { useState } from "react";
import Header from "./Components/Header";
import AdminLayout from "./Components/AdminLayout";

const Admin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const user = {
    name: "Admin User",
    avatar: "src/assets/avatar/0.png",
  };

  return (
    <>
      <Header user={user} toggleMenu={toggleMenu} />
      <AdminLayout isMenuOpen={isMenuOpen} />
    </>
  );
};

export default Admin;
