import React, { useState } from "react";
import PropTypes from "prop-types";
import './css/FormXacNhanThanhToan.css';

function FormXacNhanThanhToan({ userInfo, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    DiaChi: "",
    TenNguoiMua: userInfo?.HoTen || "",
    SoDienThoai: userInfo?.SoDienThoai || "",
    HinhThucThanhToan: "Tiền mặt",
  });

  const [errors, setErrors] = useState({
    TenNguoiMua: "",
    DiaChi: "",
    SoDienThoai: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { TenNguoiMua: "", DiaChi: "", SoDienThoai: "" };

    // Kiểm tra tên người mua (không quá 50 ký tự)
    if (formData.TenNguoiMua.length > 50) {
      newErrors.TenNguoiMua = "Tên người mua không được quá 50 ký tự.";
      valid = false;
    }

    // Kiểm tra số điện thoại (theo định dạng Việt Nam)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/; // Regex cho số điện thoại Việt Nam
    if (!phoneRegex.test(formData.SoDienThoai)) {
      newErrors.SoDienThoai = "Số điện thoại không hợp lệ.";
      valid = false;
    }

    // Kiểm tra địa chỉ (không quá 255 ký tự)
    if (formData.DiaChi.length > 255) {
      newErrors.DiaChi = "Địa chỉ không được quá 255 ký tự.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData); // Gửi dữ liệu form cho hàm onSubmit từ component cha
    } else {
      // Focus vào trường có lỗi
      for (let key in errors) {
        if (errors[key]) {
          document.querySelector(`[name=${key}]`).focus();
          break;
        }
      }
    }
  };

  const handleCancel = () => {
    onCancel(); // Gọi hàm onCancel từ component cha để đóng form
  };

  return (
    <div>
      {/* Lớp phủ làm xám phần ngoài */}
      <div className="overlay"></div>

      <div className="form-xac-nhan-thanh-toan">
        <h2>Xác nhận thanh toán</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên người mua</label>
            <input
              type="text"
              name="TenNguoiMua"
              value={formData.TenNguoiMua}
              onChange={handleChange}
              required
            />
            {errors.TenNguoiMua && <span className="error-message">{errors.TenNguoiMua}</span>}
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="DiaChi"
              value={formData.DiaChi}
              onChange={handleChange}
              required
            />
            {errors.DiaChi && <span className="error-message">{errors.DiaChi}</span>}
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="SoDienThoai"
              value={formData.SoDienThoai}
              onChange={handleChange}
              required
            />
            {errors.SoDienThoai && <span className="error-message">{errors.SoDienThoai}</span>}
          </div>
          <div className="form-group">
            <label>Hình thức thanh toán</label>
            <select
              name="HinhThucThanhToan"
              value={formData.HinhThucThanhToan}
              onChange={handleChange}
              required
            >
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">Xác nhận thanh toán</button>
            <button type="button" onClick={handleCancel}>Hủy</button> {/* Nút hủy */}
          </div>
        </form>
      </div>
    </div>
  );
}

FormXacNhanThanhToan.propTypes = {
  currentCart: PropTypes.array.isRequired,
  userInfo: PropTypes.object.isRequired, // Đảm bảo userInfo là một object
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired, // Thêm hàm onCancel
};

export default FormXacNhanThanhToan;
