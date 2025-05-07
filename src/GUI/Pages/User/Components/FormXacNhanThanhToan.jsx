import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./css/FormXacNhanThanhToan.css";

function FormXacNhanThanhToan({ userInfo, onSubmit, onCancel }) {
  const [addressData, setAddressData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const [formData, setFormData] = useState({
    TenNguoiMua: userInfo?.HoTen || "",
    SoDienThoai: userInfo?.SoDienThoai || "",
    HinhThucThanhToan: "Tiền mặt",
    DiaChi: "",
  });

  const [errors, setErrors] = useState({
    TenNguoiMua: "",
    SoDienThoai: "",
    DiaChi: "",
  });

  // Refs for focus
  const tenNguoiMuaRef = useRef(null);
  const soDienThoaiRef = useRef(null);
  const diaChiRef = useRef(null);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data) => setAddressData(data))
      .catch((err) => console.error("Lỗi khi tải địa chỉ:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStreetChange = (e) => {
    setStreetAddress(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setSelectedWard("");
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard("");
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { TenNguoiMua: "", DiaChi: "", SoDienThoai: "" };

    if (formData.TenNguoiMua.length > 50) {
      newErrors.TenNguoiMua = "Tên người mua không được quá 50 ký tự.";
      valid = false;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.SoDienThoai)) {
      newErrors.SoDienThoai = "Số điện thoại không hợp lệ.";
      valid = false;
    }

    const streetRegex = /^[a-zA-Z0-9\s/.,-àáảãạăắặẳẵâấầẩẫeéèẻẽẹêếềểễíìỉĩịóòỏõọôốồổỗộơớờởỡơúùủũụưứừửữýỳỷỹỵđ]+$/;
    if (!streetAddress || !selectedWard || !selectedDistrict || !selectedProvince) {
      newErrors.DiaChi = "Vui lòng nhập và chọn đầy đủ địa chỉ.";
      valid = false;
    } else if (!streetRegex.test(streetAddress)) {
      newErrors.DiaChi = "Số nhà, tên đường không được chứa ký tự đặc biệt.";
      valid = false;
    }

    setErrors(newErrors);

    // Focus vào ô có lỗi đầu tiên
    if (newErrors.TenNguoiMua) {
      tenNguoiMuaRef.current?.focus();
    } else if (newErrors.SoDienThoai) {
      soDienThoaiRef.current?.focus();
    } else if (newErrors.DiaChi) {
      diaChiRef.current?.focus();
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const fullAddress = `${streetAddress}$$${selectedWard}$$${selectedDistrict}$$${selectedProvince}`;
      onSubmit({ ...formData, DiaChi: fullAddress });
    }
  };

  return (
    <div>
      <div className="overlay"></div>
      <div className="form-xac-nhan-thanh-toan">
        <h2>Xác nhận thanh toán</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên người mua</label>
            <input
              type="text"
              name="TenNguoiMua"
              ref={tenNguoiMuaRef}
              value={formData.TenNguoiMua}
              onChange={handleChange}
              required
            />
            {errors.TenNguoiMua && <span className="error-message">{errors.TenNguoiMua}</span>}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="SoDienThoai"
              ref={soDienThoaiRef}
              value={formData.SoDienThoai}
              onChange={handleChange}
              required
            />
            {errors.SoDienThoai && <span className="error-message">{errors.SoDienThoai}</span>}
          </div>

          <div className="form-group">
            <label>Số nhà, tên đường</label>
            <input
              type="text"
              ref={diaChiRef}
              value={streetAddress}
              onChange={handleStreetChange}
              required
            />
          </div>
          {errors.DiaChi && <span className="error-message">{errors.DiaChi}</span>}
          <div className="form-group">
            <label>Tỉnh / Thành phố</label>
            <select value={selectedProvince} onChange={handleProvinceChange} required>
              <option value="">-- Chọn Tỉnh / Thành phố --</option>
              {addressData.map((province) => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quận / Huyện</label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              required
              disabled={!selectedProvince}
            >
              <option value="">-- Chọn Quận / Huyện --</option>
              {selectedProvince &&
                addressData
                  .find((p) => p.name === selectedProvince)
                  ?.districts.map((district) => (
                    <option key={district.code} value={district.name}>
                      {district.name}
                    </option>
                  ))}
            </select>
          </div>

          <div className="form-group">
            <label>Phường / Xã</label>
            <select
              value={selectedWard}
              onChange={handleWardChange}
              required
              disabled={!selectedDistrict}
            >
              <option value="">-- Chọn Phường / Xã --</option>
              {selectedDistrict &&
                addressData
                  .find((p) => p.name === selectedProvince)
                  ?.districts.find((d) => d.name === selectedDistrict)
                  ?.wards.map((ward) => (
                    <option key={ward.code} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
            </select>
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
            <button type="button" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

FormXacNhanThanhToan.propTypes = {
  userInfo: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FormXacNhanThanhToan;
