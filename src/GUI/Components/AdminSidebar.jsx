import "./css/AdminSidebar.css";
import React from "react";

const AdminSidebar = ({ menuItems, setSelectedFunction }) => {
  return (
    <div className="admin-sidebar">
      <ul>
        {menuItems.map((item, index) => (
          <li onClick={() => setSelectedFunction(item)} key={index}>
            <img
              src={`src/assets/icons/${item}.png`} // Đường dẫn đến ảnh theo tên quyền
              alt={item}
              className="menu-icon"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
