import { useState } from "react";

function AddUser({ onSubmit }) {
  const [formData, setFormData] = useState({
    hoTen: "",
    ngaySinh: "",
    email: "",
    gioiTinh: "Nam",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Họ tên:</label>
        <input
          type="text"
          name="hoTen"
          value={formData.hoTen}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Ngày sinh:</label>
        <input
          type="date"
          name="ngaySinh"
          value={formData.ngaySinh}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Giới tính:</label>
        <select
          name="gioiTinh"
          value={formData.gioiTinh}
          onChange={handleChange}
        >
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>
      <button type="submit">Thêm</button>
    </form>
  );
}

export default AddUser;
