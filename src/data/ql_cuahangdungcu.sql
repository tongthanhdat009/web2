
/* SQLINES DEMO *** able [dbo].[AnhSanPham]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
-- SQLINES FOR EVALUATION USE ONLY (14 DAYS)
CREATE TABLE `AnhSanPham`(
	`MaAnh` int AUTO_INCREMENT NOT NULL,
	`DuongDan` nvarchar(200) NULL,
	`MaHangHoa` int NULL,
 CONSTRAINT `PK_AnhSanPham` PRIMARY KEY 
(
	`MaAnh` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[ChiTietHangHoa]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `ChiTietHangHoa`(
	`MaHangHoa` int NULL,
	`KhoiLuong` int NULL,
	`TocDoToiDa` int NULL
);
/* SQLINES DEMO *** able [dbo].[ChiTietHoaDon]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `ChiTietHoaDon`(
	`SoLuongHang` int NULL,
	`MaHoaDon` int NOT NULL,
	`MaHangHoa` int NOT NULL,
	`Gia` int NULL,
 CONSTRAINT `PK_ChiTietHoaDon` PRIMARY KEY 
(
	`MaHoaDon` ASC,
	`MaHangHoa` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[ChiTietPhieuNhap]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `ChiTietPhieuNhap`(
	`MaPhieuNhap` int NULL,
	`MaHangHoa` int NULL,
	`SoLuong` int NULL,
	`GiaNhap` int NULL
);
/* SQLINES DEMO *** able [dbo].[ChucNang]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `ChucNang`(
	`IDChucNang` int AUTO_INCREMENT NOT NULL,
	`TenChucNang` nvarchar(50) NULL,
 CONSTRAINT `PK_ChucNang` PRIMARY KEY 
(
	`IDChucNang` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[ChungLoai]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `ChungLoai`(
	`MaChungLoai` int AUTO_INCREMENT NOT NULL,
	`TenChungLoai` nvarchar(50) NULL,
 CONSTRAINT `PK_Loai` PRIMARY KEY 
(
	`MaChungLoai` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[DanhMuc]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `DanhMuc`(
	`MaDanhMuc` int AUTO_INCREMENT NOT NULL,
	`TenDanhMuc` nvarchar(50) NULL,
 CONSTRAINT `PK_DanhMuc` PRIMARY KEY 
(
	`MaDanhMuc` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[Hang]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `Hang`(
	`MaHang` int AUTO_INCREMENT NOT NULL,
	`TenHang` nvarchar(50) NULL,
 CONSTRAINT `PK_Hang` PRIMARY KEY 
(
	`MaHang` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[HangHoa]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `HangHoa`(
	`MaHangHoa` int AUTO_INCREMENT NOT NULL,
	`MaPhanLoai` int NULL,
	`TenHangHoa` nvarchar(50) NULL,
	`MaHang` int NULL,
	`MaDanhMuc` int NULL,
	`MaKhuyenMai` int NULL,
	`MoTa` nvarchar(200) NULL,
 CONSTRAINT `PK_HangHoa` PRIMARY KEY 
(
	`MaHangHoa` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[HoaDon]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `HoaDon`(
	`MaHoaDon` int AUTO_INCREMENT NOT NULL,
	`IDTaiKhoan` int NULL,
	`NgayXuatHoaDon` date NULL,
	`NgayDuyet` date NULL,
	`TrangThai` nchar(10) NULL,
	`DiaChi` nvarchar(50) NULL,
	`TenNguoiMua` nvarchar(50) NULL,
	`SoDienThoai` nvarchar(10) NULL,
 CONSTRAINT `PK_HoaDon` PRIMARY KEY 
(
	`MaHoaDon` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[Kho]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `Kho`(
	`MaPhieuNhap` int NOT NULL,
	`MaHangHoa` int NOT NULL,
	`SoLuong` numeric(18, 0) NULL,
	`GiaBan` nvarchar(10) NULL,
 CONSTRAINT `PK_Kho` PRIMARY KEY 
(
	`MaPhieuNhap` ASC,
	`MaHangHoa` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[KhuyenMai]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `KhuyenMai`(
	`MaKhuyenMai` int AUTO_INCREMENT NOT NULL,
	`TenKhuyenMai` nvarchar(50) NULL,
	`MoTaKhuyenMai` nvarchar(50) NULL,
	`PhanTram` decimal(5, 2) NULL,
 CONSTRAINT `PK_KhuyenMai` PRIMARY KEY 
(
	`MaKhuyenMai` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[NguoiDung]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `NguoiDung`(
	`MaNguoiDung` int AUTO_INCREMENT NOT NULL,
	`HoTen` nvarchar(50) NULL,
	`GioiTinh` nvarchar(3) NULL,
	`Email` nvarchar(255) NULL,
	`NgaySinh` date NULL,
	`SoDienThoai` char(10) NULL,
	`IDTaiKhoan` int NULL,
	`Anh` nvarchar(50) NULL,
 CONSTRAINT `PK_NguoiDung` PRIMARY KEY 
(
	`MaNguoiDung` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[NhaCungCap]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `NhaCungCap`(
	`MaNhaCungCap` int AUTO_INCREMENT NOT NULL,
	`TenNhaCungCap` nvarchar(50) NULL,
 CONSTRAINT `PK_NhaCungCap` PRIMARY KEY 
(
	`MaNhaCungCap` ASC
) ,
 CONSTRAINT `UQ_MaNhaCungCap` UNIQUE 
(
	`MaNhaCungCap` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[NhanVien]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `NhanVien`(
	`MaNguoiDung` int NULL,
	`TenNhanVien` nvarchar(50) NULL,
	`NgaySinh` date NULL,
	`SoDienThoai` char(10) NULL,
	`Luong` numeric(18, 2) NULL
);
/* SQLINES DEMO *** able [dbo].[PhanLoai]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `PhanLoai`(
	`MaPhanLoai` int AUTO_INCREMENT NOT NULL,
	`TenPhanLoai` nvarchar(50) NULL,
	`MaChungLoai` int NULL,
 CONSTRAINT `PK_PhanLoai` PRIMARY KEY 
(
	`MaPhanLoai` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[PhanQuyen]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `PhanQuyen`(
	`IDChucNang` int NOT NULL,
	`IDQuyen` int NOT NULL
);
/* SQLINES DEMO *** able [dbo].[PhieuNhap]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `PhieuNhap`(
	`MaPhieuNhap` int AUTO_INCREMENT NOT NULL,
	`TrangThai` nvarchar(20) NULL,
	`IDTaiKhoan` int NULL,
	`MaNhaCungCap` int NULL,
	`NgayNhap` date NULL,
 CONSTRAINT `PK_PhieuNhap` PRIMARY KEY 
(
	`MaPhieuNhap` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[Quyen]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `Quyen`(
	`IDQuyen` int AUTO_INCREMENT NOT NULL,
	`TenQuyen` nvarchar(50) NULL,
 CONSTRAINT `PK_Quyen` PRIMARY KEY 
(
	`IDQuyen` ASC
) ,
 CONSTRAINT `UQ_TenQuyen` UNIQUE 
(
	`TenQuyen` ASC
) 
);
/* SQLINES DEMO *** able [dbo].[TaiKhoan]    Script Date: 12/02/2025 9:22:01 CH ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE `TaiKhoan`(
	`IDTaiKhoan` int AUTO_INCREMENT NOT NULL,
	`TaiKhoan` char(20) NULL,
	`MatKhau` varchar(255) NULL,
	`IDQuyen` int NULL,
 CONSTRAINT `PK_TaiKhoan` PRIMARY KEY 
(
	`IDTaiKhoan` ASC
) 
);
ALTER TABLE `AnhSanPham` ADD  CONSTRAINT `FK_AnhSanPham_HangHoa` FOREIGN KEY(`MaHangHoa`)
REFERENCES `HangHoa` (`MaHangHoa`);
 
/* ALTER TABLE `AnhSanPham` CHECK CONSTRAINT `FK_AnhSanPham_HangHoa`; */
 
ALTER TABLE `ChiTietHangHoa` ADD  CONSTRAINT `FK_ChiTietHangHoa_HangHoa` FOREIGN KEY(`MaHangHoa`)
REFERENCES `HangHoa` (`MaHangHoa`);
 
/* ALTER TABLE `ChiTietHangHoa` CHECK CONSTRAINT `FK_ChiTietHangHoa_HangHoa`; */
 
ALTER TABLE `ChiTietHoaDon` ADD  CONSTRAINT `FK_ChiTietHoaDon_HangHoa` FOREIGN KEY(`MaHangHoa`)
REFERENCES `HangHoa` (`MaHangHoa`);
 
/* ALTER TABLE `ChiTietHoaDon` CHECK CONSTRAINT `FK_ChiTietHoaDon_HangHoa`; */
 
ALTER TABLE `ChiTietHoaDon` ADD  CONSTRAINT `FK_ChiTietHoaDon_HoaDon1` FOREIGN KEY(`MaHoaDon`)
REFERENCES `HoaDon` (`MaHoaDon`);
 
/* ALTER TABLE `ChiTietHoaDon` CHECK CONSTRAINT `FK_ChiTietHoaDon_HoaDon1`; */
 
ALTER TABLE `ChiTietPhieuNhap` ADD  CONSTRAINT `FK_ChiTietPhieuNhap_HangHoa` FOREIGN KEY(`MaHangHoa`)
REFERENCES `HangHoa` (`MaHangHoa`);
 
/* ALTER TABLE `ChiTietPhieuNhap` CHECK CONSTRAINT `FK_ChiTietPhieuNhap_HangHoa`; */
 
ALTER TABLE `ChiTietPhieuNhap` ADD  CONSTRAINT `FK_ChiTietPhieuNhap_PhieuNhap` FOREIGN KEY(`MaPhieuNhap`)
REFERENCES `PhieuNhap` (`MaPhieuNhap`);
 
/* ALTER TABLE `ChiTietPhieuNhap` CHECK CONSTRAINT `FK_ChiTietPhieuNhap_PhieuNhap`; */
 
ALTER TABLE `HangHoa` ADD  CONSTRAINT `FK_HangHoa_DanhMuc` FOREIGN KEY(`MaDanhMuc`)
REFERENCES `DanhMuc` (`MaDanhMuc`);
 
/* ALTER TABLE `HangHoa` CHECK CONSTRAINT `FK_HangHoa_DanhMuc`; */
 
ALTER TABLE `HangHoa` ADD  CONSTRAINT `FK_HangHoa_Hang` FOREIGN KEY(`MaHang`)
REFERENCES `Hang` (`MaHang`);
 
/* ALTER TABLE `HangHoa` CHECK CONSTRAINT `FK_HangHoa_Hang`; */
 
ALTER TABLE `HangHoa` ADD  CONSTRAINT `FK_HangHoa_KhuyenMai1` FOREIGN KEY(`MaKhuyenMai`)
REFERENCES `KhuyenMai` (`MaKhuyenMai`);
 
/* ALTER TABLE `HangHoa` CHECK CONSTRAINT `FK_HangHoa_KhuyenMai1`; */
 
ALTER TABLE `HangHoa` ADD  CONSTRAINT `FK_HangHoa_PhanLoai` FOREIGN KEY(`MaPhanLoai`)
REFERENCES `PhanLoai` (`MaPhanLoai`);
 
/* ALTER TABLE `HangHoa` CHECK CONSTRAINT `FK_HangHoa_PhanLoai`; */
 
ALTER TABLE `HoaDon` ADD  CONSTRAINT `FK_HoaDon_TaiKhoan1` FOREIGN KEY(`IDTaiKhoan`)
REFERENCES `TaiKhoan` (`IDTaiKhoan`);
 
/* ALTER TABLE `HoaDon` CHECK CONSTRAINT `FK_HoaDon_TaiKhoan1`; */
 
ALTER TABLE `Kho` ADD  CONSTRAINT `FK_Kho_HangHoa` FOREIGN KEY(`MaHangHoa`)
REFERENCES `HangHoa` (`MaHangHoa`);
 
/* ALTER TABLE `Kho` CHECK CONSTRAINT `FK_Kho_HangHoa`; */
 
ALTER TABLE `Kho` ADD  CONSTRAINT `FK_Kho_PhieuNhap` FOREIGN KEY(`MaPhieuNhap`)
REFERENCES `PhieuNhap` (`MaPhieuNhap`);
 
/* ALTER TABLE `Kho` CHECK CONSTRAINT `FK_Kho_PhieuNhap`; */
 
ALTER TABLE `NguoiDung` ADD  CONSTRAINT `FK_HoiVien_TaiKhoan1` FOREIGN KEY(`IDTaiKhoan`)
REFERENCES `TaiKhoan` (`IDTaiKhoan`);
 
/* ALTER TABLE `NguoiDung` CHECK CONSTRAINT `FK_HoiVien_TaiKhoan1`; */
 
ALTER TABLE `NhanVien` ADD  CONSTRAINT `FK_NhanVien_NguoiDung` FOREIGN KEY(`MaNguoiDung`)
REFERENCES `NguoiDung` (`MaNguoiDung`);
 
/* ALTER TABLE `NhanVien` CHECK CONSTRAINT `FK_NhanVien_NguoiDung`; */
 
ALTER TABLE `PhanLoai` ADD  CONSTRAINT `FK_PhanLoai_ChungLoai` FOREIGN KEY(`MaChungLoai`)
REFERENCES `ChungLoai` (`MaChungLoai`);
 
/* ALTER TABLE `PhanLoai` CHECK CONSTRAINT `FK_PhanLoai_ChungLoai`; */
 
ALTER TABLE `PhanQuyen` ADD  CONSTRAINT `FK_PhanQuyen_Quyen` FOREIGN KEY(`IDChucNang`)
REFERENCES `ChucNang` (`IDChucNang`);
 
/* ALTER TABLE `PhanQuyen` CHECK CONSTRAINT `FK_PhanQuyen_Quyen`; */
 
ALTER TABLE `PhanQuyen` ADD  CONSTRAINT `FK_PhanQuyen_Quyen1` FOREIGN KEY(`IDQuyen`)
REFERENCES `Quyen` (`IDQuyen`);
 
/* ALTER TABLE `PhanQuyen` CHECK CONSTRAINT `FK_PhanQuyen_Quyen1`; */
 
ALTER TABLE `PhieuNhap` ADD  CONSTRAINT `FK_PhieuNhap_NhaCungCap` FOREIGN KEY(`MaNhaCungCap`)
REFERENCES `NhaCungCap` (`MaNhaCungCap`);
 
/* ALTER TABLE `PhieuNhap` CHECK CONSTRAINT `FK_PhieuNhap_NhaCungCap`; */
 
ALTER TABLE `PhieuNhap` ADD  CONSTRAINT `FK_PhieuNhap_TaiKhoan` FOREIGN KEY(`IDTaiKhoan`)
REFERENCES `TaiKhoan` (`IDTaiKhoan`);
 
/* ALTER TABLE `PhieuNhap` CHECK CONSTRAINT `FK_PhieuNhap_TaiKhoan`; */
 
ALTER TABLE `TaiKhoan` ADD  CONSTRAINT `FK_TaiKhoan_Quyen` FOREIGN KEY(`IDQuyen`)
REFERENCES `Quyen` (`IDQuyen`);
 
/* ALTER TABLE `TaiKhoan` CHECK CONSTRAINT `FK_TaiKhoan_Quyen`; */
 
ALTER TABLE `KhuyenMai` ADD  CONSTRAINT `CHK_PhanTram` CHECK  ((`PhanTram`>=(0) AND `PhanTram`<=(100)));
 
/* ALTER TABLE `KhuyenMai` CHECK CONSTRAINT `CHK_PhanTram`; */
 
