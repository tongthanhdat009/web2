import "./css/AdminSidebar.css";
import React from "react";
import { useNavigate } from "react-router-dom";

// Hàm chuyển đổi chuỗi thành slug URL
const toSlug = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/đ/g, "d") // Chuyển đổi "đ" -> "d"
    .replace(/Đ/g, "d") // Chuyển đổi "Đ" -> "d"
    .replace(/\s+/g, "-") // Thay khoảng trắng thành dấu "-"
    .replace(/[^a-z0-9\-]/g, "") // Xóa ký tự không hợp lệ
    .replace(/-+/g, "-") // Loại bỏ dấu "-" dư thừa
    .trim();
};

const AdminSidebar = ({ menuItems }) => {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <ul>
        {menuItems.map((item, index) => {
          const slug = toSlug(item); // Chuyển đổi tên thành slug URL
          return (
            <li onClick={() => navigate(`/admin/${slug}`)} key={index}>
              <img src={`/assets/icons/${item}.png`} alt={item} className="menu-icon" />
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
