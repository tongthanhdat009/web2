import React, { useState, useEffect } from 'react';
import Slider from "../../Components/TrangChuNguoiDung/Slider.jsx";
import TieuDeDanhSach from "../../Components/TrangChuNguoiDung/TieuDeDanhSach.jsx";
import ChinhSachComponent from "../../Components/TrangChuNguoiDung/ChinhSachComponent.jsx";
import SanPhamCardLayout from '../../Components/SanPhamCardLayout.jsx';

function TrangChuUser() {
  return (
    <>
      <Slider />
      <ChinhSachComponent />
      <TieuDeDanhSach TieuDeDanhSach="Các danh mục nổi bật" MoTa="Danh mục bán được nhiều sản phẩm" />
      {/* Thêm class 'flex-wrap' vào đây */}
      <div style={{marginLeft:"10%", marginRight:"10%"}} className="d-flex flex-wrap mb-3 justify-content-start" id="DanhMucNoiBat"> {/* Thêm flex-wrap và tùy chọn justify-content */}
        <div className="col-12 col-md-6 col-lg-4 p-2"> {/* Bọc mỗi card trong một cột */}
          <SanPhamCardLayout Anh="/assets/AnhHangHoa/1.png" // Sửa đường dẫn ảnh
            MoTa = "Tạ 2.5Kg"
            TenHangHoa = "Tạ 2.5Kg"
            GiaBan = "500.000đ"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4 p-2"> {/* Bọc mỗi card trong một cột */}
          <SanPhamCardLayout Anh="/assets/AnhHangHoa/1.png" // Sửa đường dẫn ảnh
            MoTa = "Tạ 2.5Kg"
            TenHangHoa = "Tạ 2.5Kg"
            GiaBan = "500.000đ"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4 p-2"> {/* Bọc mỗi card trong một cột */}
          <SanPhamCardLayout Anh="/assets/AnhHangHoa/1.png" // Sửa đường dẫn ảnh
            MoTa = "Tạ 2.5Kg"
            TenHangHoa = "Tạ 2.5Kg"
            GiaBan = "500.000đ"
          />
        </div>
         {/* Thêm các sản phẩm khác nếu cần */}
         <div className="col-12 col-md-6 col-lg-4 p-2"> {/* Bọc mỗi card trong một cột */}
          <SanPhamCardLayout Anh="/assets/AnhHangHoa/2.png" // Ví dụ sản phẩm khác
            MoTa = "Tạ 5Kg"
            TenHangHoa = "Tạ 5Kg"
            GiaBan = "800.000đ"
          />
        </div>
         <div className="col-12 col-md-6 col-lg-4 p-2"> {/* Bọc mỗi card trong một cột */}
          <SanPhamCardLayout Anh="/assets/AnhHangHoa/3.png" // Ví dụ sản phẩm khác
            MoTa = "Tạ 10Kg"
            TenHangHoa = "Tạ 10Kg"
            GiaBan = "1.200.000đ"
          />
        </div>

      </div>

      <TieuDeDanhSach TieuDeDanhSach="Các thiết bị tạ" MoTa="Các loại tạ theo khối lượng" />
      <div style={{marginLeft:"10%", marginRight:"10%"}} className="row mb-3" id="CacThietBiTa"> {/* Sử dụng row cho layout grid */}
        {/* Thêm các SanPhamCardLayout vào đây, bọc trong các div cột */}
        {/* Ví dụ: */}
        {/* <div className="col-12 col-md-6 col-lg-4 p-2"> <SanPhamCardLayout ... /> </div> */}
      </div>

      {/* ... các phần còn lại tương tự ... */}
      <TieuDeDanhSach TieuDeDanhSach="Thiết bị cardio" MoTa="Các thiết bị đốt năng lượng nhanh" />
      <div style={{marginLeft:"10%", marginRight:"10%"}} className="row mb-3" id="ThietBiCardio">
         {/* Thêm các SanPhamCardLayout vào đây, bọc trong các div cột */}
      </div>

      <TieuDeDanhSach TieuDeDanhSach="Thời trang thể thao" MoTa="Quần áo chuyên dụng cho thể thao" />
      <div style={{marginLeft:"10%", marginRight:"10%"}} className="row mb-3" id="ThoiTrangTheThao"> {/* Đổi ID nếu cần */}
         {/* Thêm các SanPhamCardLayout vào đây, bọc trong các div cột */}
      </div>

      <TieuDeDanhSach TieuDeDanhSach="Các thiết bị khác" MoTa="Ghế tập, xà đơn, xà kép,..." />
       <div style={{marginLeft:"10%", marginRight:"10%"}} className="row mb-3" id="CacThietBiKhac">
         {/* Thêm các SanPhamCardLayout vào đây, bọc trong các div cột */}
      </div>
    </>
  );
}
export default TrangChuUser;