import "./css/AdminSidebar.css";
import React from "react";
import { useNavigate } from "react-router-dom";

// Hàm chuyển đổi chuỗi thành slug URL
const toSlug = (str) => {
  if (!str) return '';
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

// Menu items mặc định
const defaultMenuItems = [
  "Trang chủ",
  "Quản lý khuyến mãi",
  "Quản lý hãng",
  "Quản lý nhà cung cấp",
  "Quản lý phiếu nhập",
  "Quản lý hàng hóa",
  "Quản lý chủng loại",
  "Quản lý đơn hàng",
  "Quản lý người dùng",
  "Quản lý phân quyền",
  "Tra cứu sản phẩm"
];

const AdminSidebar = ({ menuItems = defaultMenuItems }) => {
  const navigate = useNavigate();

  // Mapping tên menu với đường dẫn
  const menuToPath = {
    "Trang chủ": "trang-chu",
  
    "Quản lý khuyến mãi": "quan-ly-khuyen-mai",
    "Quản lý hãng": "quan-ly-hang",
    "Quản lý nhà cung cấp": "quan-ly-nha-cung-cap",
    "Quản lý phiếu nhập": "quan-ly-phieu-nhap",
    "Quản lý hàng hóa": "quan-ly-hang-hoa",
    "Quản lý chủng loại": "quan-ly-chung-loai",
    "Quản lý đơn hàng": "quan-ly-don-hang",
    "Quản lý người dùng": "quan-ly-nguoi-dung",
    "Quản lý phân quyền": "quan-ly-phan-quyen",
    "Tra cứu sản phẩm": "tra-cuu-san-pham"
  };

  return (
    <div className="admin-sidebar">
      <ul>
        {(menuItems || []).map((item, index) => {
          // Sử dụng path từ mapping hoặc tạo slug nếu không có
          const path = menuToPath[item] || toSlug(item);
          return (
            <li onClick={() => navigate(`/admin/${path}`)} key={index}>
              <img 
                src={`/assets/icons/${item}.png`} 
                alt={item} 
                className="menu-icon"
                onError={(e) => {
                  e.target.src = '/assets/icons/default.png';
                }}
              />
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
