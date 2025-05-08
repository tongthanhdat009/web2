-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 08, 2025 lúc 04:00 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ql_cuahangdungcu`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiethoadon`
--

CREATE TABLE `chitiethoadon` (
  `MaHoaDon` int(11) NOT NULL,
  `Seri` int(11) DEFAULT NULL,
  `GiaBan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietphieunhap`
--

CREATE TABLE `chitietphieunhap` (
  `IDChiTietPhieuNhap` int(11) NOT NULL,
  `MaPhieuNhap` int(11) NOT NULL,
  `MaHangHoa` int(11) NOT NULL,
  `IDKhoiLuongTa` int(11) DEFAULT NULL,
  `IDKichThuocQuanAo` int(11) DEFAULT NULL,
  `IDKichThuocGiay` int(11) DEFAULT NULL,
  `GiaNhap` int(11) NOT NULL,
  `GiaBan` int(11) NOT NULL,
  `SoLuongNhap` int(11) NOT NULL,
  `SoLuongTon` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietphieunhap`
--

INSERT INTO `chitietphieunhap` (`IDChiTietPhieuNhap`, `MaPhieuNhap`, `MaHangHoa`, `IDKhoiLuongTa`, `IDKichThuocQuanAo`, `IDKichThuocGiay`, `GiaNhap`, `GiaBan`, `SoLuongNhap`, `SoLuongTon`) VALUES
(41, 48, 1, 3, 0, 0, 200000, 250000, 10, 10),
(42, 48, 2, 6, 0, 0, 230000, 280000, 10, 10),
(43, 48, 5, 10, 0, 0, 300000, 330000, 5, 5),
(44, 48, 12, 5, 0, 0, 200000, 200000, 5, 5),
(45, 48, 15, 8, 0, 0, 250000, 300000, 5, 5),
(46, 48, 20, 0, 0, 0, 7000000, 10000000, 3, 3),
(47, 48, 21, 0, 0, 0, 6000000, 9000000, 3, 3),
(48, 48, 91, 0, 0, 0, 10000000, 12000000, 3, 3),
(49, 48, 95, 0, 0, 0, 9000000, 11000000, 3, 3),
(50, 48, 22, 0, 1, 0, 150000, 200000, 20, 20),
(51, 48, 22, 0, 2, 0, 150000, 200000, 20, 20),
(52, 48, 23, 0, 1, 0, 130000, 150000, 20, 20),
(53, 48, 23, 0, 2, 0, 150000, 160000, 20, 20),
(54, 48, 32, 0, 2, 0, 200000, 230000, 15, 15),
(55, 48, 37, 0, 4, 0, 300000, 350000, 15, 15),
(56, 48, 88, 0, 0, 0, 20000, 50000, 50, 50),
(57, 48, 100, 0, 0, 0, 8000000, 10000000, 2, 2),
(58, 48, 101, 0, 0, 0, 5000000, 7000000, 2, 2),
(59, 48, 107, 0, 0, 5, 500000, 600000, 10, 10),
(60, 48, 107, 0, 0, 6, 550000, 650000, 10, 10),
(61, 48, 105, 0, 0, 4, 600000, 800000, 10, 10),
(62, 48, 78, 0, 0, 0, 100000, 150000, 10, 10),
(63, 48, 60, 0, 0, 0, 1000000, 1200000, 10, 10),
(64, 48, 67, 0, 0, 0, 500000, 700000, 10, 10),
(65, 48, 55, 0, 0, 0, 1000000, 1200000, 10, 10),
(66, 48, 64, 0, 0, 0, 400000, 500000, 10, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chucnang`
--

CREATE TABLE `chucnang` (
  `IDChucNang` int(11) NOT NULL,
  `TenChucNang` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chucnang`
--

INSERT INTO `chucnang` (`IDChucNang`, `TenChucNang`) VALUES
(1, 'Trang chủ'),
(2, 'Quản lý khuyến mãi'),
(3, 'Quản lý hãng'),
(4, 'Quản lý nhà cung cấp'),
(5, 'Quản lý phiếu nhập'),
(6, 'Quản lý hàng hóa'),
(7, 'Quản lý chủng loại'),
(8, 'Quản lý đơn hàng'),
(9, 'Quản lý người dùng'),
(10, 'Quản lý phân quyền'),
(11, 'Tra cứu sản phẩm');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chungloai`
--

CREATE TABLE `chungloai` (
  `MaChungLoai` int(11) NOT NULL,
  `TenChungLoai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MaTheLoai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chungloai`
--

INSERT INTO `chungloai` (`MaChungLoai`, `TenChungLoai`, `MaTheLoai`) VALUES
(1, 'Tạ tayyy', 1),
(2, 'Tạ đòn', 1),
(3, 'Tạ bình vôi', 1),
(4, 'Tạ bánh', 1),
(5, 'Tạ điều chỉnh', 1),
(6, 'Máy chạy bộ điện', 2),
(7, 'Máy chạy bộ cơ', 2),
(8, 'Máy chạy bộ gấp gọn', 2),
(9, 'Máy chạy bộ chuyên dụng', 2),
(10, 'Máy chèo thuyền', 2),
(11, 'Máy leo cầu thang', 2),
(12, 'Áo thể thao', 3),
(13, 'Quần thể thao', 3),
(14, 'Bộ đồ gym', 3),
(15, 'Quần legging', 3),
(16, 'Áo hoodie thể thao', 3),
(17, 'Thực phẩm tăng cơ & bổ sung protein', 4),
(18, 'Thực phẩm sức mạnh & sức bền', 4),
(19, 'Dây kháng lực', 5),
(20, 'Xà đơn', 5),
(21, 'Xà kép', 5),
(22, 'Ghế tập tạ', 5),
(23, 'Dây nhảy thể lực', 5),
(24, 'Xà xà', 5),
(25, 'Tạ tay', 1),
(26, 'Chạy bộ', 6),
(27, 'Bóng đá', 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giohang`
--

CREATE TABLE `giohang` (
  `IDTaiKhoan` int(11) NOT NULL,
  `MaHangHoa` int(11) NOT NULL,
  `IDKhoiLuongTa` int(11) NOT NULL,
  `IDKichThuocQuanAo` int(11) NOT NULL,
  `IDKichThuocGiay` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hang`
--

CREATE TABLE `hang` (
  `MaHang` int(11) NOT NULL,
  `TenHang` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hang`
--

INSERT INTO `hang` (`MaHang`, `TenHang`) VALUES
(1, 'Bofitt'),
(2, 'Nike'),
(3, 'Adidas'),
(4, 'Puma'),
(5, 'Jordan'),
(6, 'Yonex'),
(7, 'Under Armour'),
(8, 'Reebok'),
(9, 'Optimum Nutrition'),
(10, 'MyProtein'),
(11, 'Dymatize'),
(12, 'MuscleTech'),
(13, 'BSN'),
(14, 'Kingsport'),
(15, 'Xiaomi FED'),
(16, 'Động Lực'),
(17, 'Yasu'),
(18, 'Aolikes'),
(19, 'Royal'),
(20, 'King Smith'),
(21, 'Decathlon'),
(22, 'Tiger Sport');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hanghoa`
--

CREATE TABLE `hanghoa` (
  `MaHangHoa` int(11) NOT NULL,
  `MaChungLoai` int(11) DEFAULT NULL,
  `TenHangHoa` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MaHang` int(11) DEFAULT NULL,
  `MaKhuyenMai` int(11) DEFAULT NULL,
  `MoTa` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ThoiGianBaoHanh` int(11) DEFAULT NULL,
  `Anh` varchar(255) DEFAULT NULL,
  `TrangThai` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hanghoa`
--

INSERT INTO `hanghoa` (`MaHangHoa`, `MaChungLoai`, `TenHangHoa`, `MaHang`, `MaKhuyenMai`, `MoTa`, `ThoiGianBaoHanh`, `Anh`, `TrangThai`) VALUES
(1, 1, 'Tạ tay cao su BoFit 2.5Kg', 1, 4, 'Tạ Tập Tay BoFit 2.5Kg.', 22, '../assets/AnhHangHoa/1.png', 1),
(2, 1, 'Tạ tay cao su BoFit 5Kg', 1, NULL, 'Tạ Tập Tay BoFit 5Kg.', 24, '../assets/AnhHangHoa/2.png', 1),
(3, 1, 'Tạ tay cao su BoFit 7.5Kg', 1, NULL, 'Tạ tay cao su BoFit 7.5Kg', 24, '../assets/AnhHangHoa/3.png', 1),
(4, 1, 'Tạ Tay Bọc Cao Su BoFit 10kg', 1, NULL, 'Tạ Tay Bọc Cao Su BoFit 10kg', 24, '../assets/AnhHangHoa/4.png', 1),
(5, 1, 'Tạ tay cao su BoFit 15kg', 1, NULL, 'Tạ tay cao su BoFit 15kg', 24, '../assets/AnhHangHoa/5.png', 1),
(6, 2, 'Tạ thanh đòn cong BoFit 10Kg', 1, NULL, 'Tạ thanh đòn cong BoFit 10Kg', 24, '../assets/AnhHangHoa/6.png', 1),
(7, 2, 'Tạ thanh đòn cong BoFit 10Kg', 1, NULL, 'Tạ thanh đòn thẳng BoFit 10Kg', 24, '../assets/AnhHangHoa/7.png', 1),
(8, 2, 'Tạ thanh đòn cong BoFit 15Kg', 1, NULL, 'Tạ thanh đòn cong BoFit 15Kg', 24, '../assets/AnhHangHoa/8.png', 1),
(9, 2, 'Tạ thanh đòn thẳng BoFit 15Kg', 1, NULL, 'Tạ thanh đòn thẳng BoFit 15Kg', 24, '../assets/AnhHangHoa/9.png', 1),
(10, 2, 'Tạ thanh đòn thẳng BoFit 20Kg', 1, NULL, 'Tạ thanh đòn thẳng BoFit 20Kg', 24, '../assets/AnhHangHoa/10.png', 1),
(11, 2, 'Tạ thanh đòn cong BoFit 20Kg', 1, NULL, 'Tạ thanh đòn cong BoFit 20Kg', 24, '../assets/AnhHangHoa/11.png', 1),
(12, 3, 'Tạ bình vôi BoFit 4Kg', 1, NULL, 'Tạ bình vôi BoFit 4Kg', 24, '../assets/AnhHangHoa/12.png', 1),
(13, 3, 'Tạ bình BoFit 6Kg', 1, NULL, 'Tạ bình BoFit 6Kg', 24, '../assets/AnhHangHoa/13.png', 1),
(14, 3, 'Tạ bình BoFit 8Kg', 1, NULL, 'Tạ bình BoFit 8Kg', 24, '../assets/AnhHangHoa/14.png', 1),
(15, 3, 'Tạ bình vôi BoFit 10Kg', 1, NULL, 'Tạ bình vôi BoFit 10Kg', 24, '../assets/AnhHangHoa/15.png', 1),
(16, 4, 'Tạ bánh cao su BoFit 5Kg', 1, NULL, 'Tạ bánh cao su BoFit 5Kg', 24, '../assets/AnhHangHoa/16.png', 1),
(17, 4, 'Tạ bánh cao su BoFit 10Kg', 1, NULL, 'Tạ bánh cao su BoFit 10Kg', 24, '../assets/AnhHangHoa/17.png', 1),
(18, 5, 'Tạ tay điều chỉnh BoFit 20Kg', 1, NULL, 'Tạ tay điều chỉnh BoFit 20Kg', 24, '../assets/AnhHangHoa/18.png', 1),
(19, 5, 'Tạ tay điều chỉnh BoFit 32Kg', 1, NULL, 'Tạ tay điều chỉnh BoFit 32Kg', 24, '../assets/AnhHangHoa/19.png', 1),
(20, 6, 'Máy Chạy Bộ Điện BoFit X7', 1, NULL, 'Máy Chạy Bộ Điện BoFit X7', 24, '../assets/AnhHangHoa/20.png', 1),
(21, 6, 'Máy Chạy Bộ Điện BoFit X6', 1, NULL, 'Máy Chạy Bộ Điện BoFit X6', 24, '../assets/AnhHangHoa/21.png', 1),
(22, 12, 'Áo Thun Nike Dri-FIT', 2, 1, 'Áo Thun Nike Dri-FIT', 0, '../assets/AnhHangHoa/22.png', 1),
(23, 12, 'Áo Polo Nike Court Victory', 2, NULL, 'Áo Polo Nike Court Victory', 0, '../assets/AnhHangHoa/23.png', 1),
(24, 12, 'Áo Hoodie Nike Club Fleece', 2, NULL, 'Áo Hoodie Nike Club Fleece', 0, '../assets/AnhHangHoa/24.png', 1),
(25, 12, 'Áo Thun Adidas Aeroready', 3, NULL, 'Áo Thun Adidas Aeroready', 0, '../assets/AnhHangHoa/25.png', 1),
(26, 12, 'Áo Polo Adidas Performance', 3, NULL, NULL, 0, '../assets/AnhHangHoa/26.png', 1),
(27, 12, 'Áo Hoodie Adidas Essentials', 3, NULL, NULL, 0, '../assets/AnhHangHoa/27.png', 1),
(28, 12, 'Áo Thun Puma Run', 4, NULL, NULL, 0, '../assets/AnhHangHoa/28.png', 1),
(29, 12, 'Áo Polo Puma Essentials', 4, NULL, NULL, 0, '../assets/AnhHangHoa/29.png', 1),
(30, 12, 'Áo Hoodie Puma Power', 4, NULL, NULL, 0, '../assets/AnhHangHoa/30.png', 1),
(31, 13, 'Quần thể thao Nike Dri-FIT', 2, NULL, NULL, 0, '../assets/AnhHangHoa/31.png', 1),
(32, 13, 'Quần tập gym Adidas Training', 3, NULL, NULL, 0, '../assets/AnhHangHoa/32.png', 1),
(33, 13, 'Quần thể thao Puma Active', 4, NULL, NULL, 0, '../assets/AnhHangHoa/33.png', 1),
(34, 13, 'Quần short thể thao Nike Flex', 2, NULL, NULL, 0, '../assets/AnhHangHoa/34.png', 1),
(35, 13, 'Quần jogger Adidas Performance', 3, NULL, NULL, 0, '../assets/AnhHangHoa/35.png', 1),
(36, 13, 'Quần short Puma Fit', 4, NULL, NULL, 0, '../assets/AnhHangHoa/36.png', 1),
(37, 13, 'Quần bóng đá Nike Strike', 2, NULL, NULL, 0, '../assets/AnhHangHoa/37.png', 1),
(38, 13, 'Quần đá banh Adidas Squadra', 3, NULL, NULL, 0, '../assets/AnhHangHoa/38.png', 1),
(39, 13, 'Quần thể thao Puma Essentials', 4, NULL, NULL, 0, '../assets/AnhHangHoa/39.png', 1),
(40, 14, 'Nike Dri-FIT Training Set', 2, NULL, NULL, 0, '../assets/AnhHangHoa/40.png', 1),
(41, 14, 'Adidas Aeroready 3-Stripes Set', 3, NULL, NULL, 0, '../assets/AnhHangHoa/41.png', 1),
(42, 14, 'Puma Fit Woven Gym Set', 4, NULL, NULL, 0, '../assets/AnhHangHoa/42.png', 1),
(43, 14, 'Jordan Dri-FIT Sport Set', 5, NULL, NULL, 0, '../assets/AnhHangHoa/43.png', 1),
(44, 15, 'Nike One Dri-FIT Leggings', 2, NULL, NULL, 0, '../assets/AnhHangHoa/44.png', 1),
(45, 15, 'Adidas Aeroready Designed 2 Move Leggings', 3, NULL, NULL, 0, '../assets/AnhHangHoa/45.png', 1),
(46, 15, 'Puma Fit High Waist Training Leggings', 4, NULL, NULL, 0, '../assets/AnhHangHoa/46.png', 1),
(47, 15, 'Jordan Essentials Women\'s Leggings', 5, NULL, NULL, 0, '../assets/AnhHangHoa/47.png', 1),
(48, 16, 'Nike Sportswear Club Fleece Hoodie', 2, NULL, NULL, 0, '../assets/AnhHangHoa/48.png', 1),
(49, 16, 'Adidas Essentials Fleece Hoodie', 3, NULL, NULL, 0, '../assets/AnhHangHoa/49.png', 1),
(50, 16, 'Puma Essential Logo Hoodie', 4, NULL, NULL, 0, '../assets/AnhHangHoa/50.png', 1),
(51, 16, 'Jordan Jumpman Fleece Pullover Hoodie', 5, NULL, NULL, 0, '../assets/AnhHangHoa/51.png', 1),
(52, 16, 'Under Armour Rival Fleece Hoodie', 7, NULL, NULL, 0, '../assets/AnhHangHoa/52.png', 1),
(53, 16, 'Reebok Identity Big Logo Hoodie', 8, NULL, NULL, 0, '../assets/AnhHangHoa/53.png', 1),
(54, 17, 'Optimum Nutrition Gold Standard Whey (2.27kg)', 9, NULL, NULL, 0, '../assets/AnhHangHoa/54.png', 1),
(55, 17, 'Optimum Nutrition Serious Mass (5.45kg)', 9, NULL, NULL, 0, '../assets/AnhHangHoa/55.png', 1),
(56, 17, 'MyProtein Impact Whey Protein (2.5kg)', 10, NULL, NULL, 0, '../assets/AnhHangHoa/56.png', 1),
(57, 17, 'MyProtein THE Whey+ (2kg)', 10, NULL, NULL, 0, '../assets/AnhHangHoa/57.png', 1),
(58, 17, 'Dymatize ISO100 Hydrolyzed (2.3kg)', 11, NULL, NULL, 0, '../assets/AnhHangHoa/58.png', 1),
(59, 17, 'Dymatize Super Mass Gainer (5.4kg)', 11, NULL, NULL, 0, '../assets/AnhHangHoa/59.png', 1),
(60, 17, 'MuscleTech NitroTech Whey Gold (2.27kg)', 12, NULL, NULL, 0, '../assets/AnhHangHoa/60.png', 1),
(61, 17, 'MuscleTech Mass Tech Extreme 2000 (5.45kg)', 12, NULL, NULL, 0, '../assets/AnhHangHoa/61.png', 1),
(62, 17, 'BSN Syntha-6 Ultra Premium Protein (2.27kg)', 13, NULL, NULL, 0, '../assets/AnhHangHoa/62.png', 1),
(63, 17, 'BSN True-Mass 1200 (4.7kg)', 13, NULL, NULL, 0, '../assets/AnhHangHoa/63.png', 1),
(64, 18, 'Optimum Nutrition Amino Energy (270g)', 9, NULL, NULL, 0, '../assets/AnhHangHoa/64.png', 1),
(65, 18, 'Optimum Nutrition Creatine Powder (300g)', 9, NULL, NULL, 0, '../assets/AnhHangHoa/65.png', 1),
(66, 18, 'MyProtein Creatine Monohydrate (500g)', 10, NULL, NULL, 0, '../assets/AnhHangHoa/66.png', 1),
(67, 18, 'MyProtein Essential BCAA 2:1:1 (500g)', 10, NULL, NULL, 0, '../assets/AnhHangHoa/67.png', 1),
(68, 18, 'Dymatize Creatine Micronized (300g)', 11, NULL, NULL, 0, '../assets/AnhHangHoa/68.png', 1),
(69, 18, 'Dymatize BCAA Complex 2200 (200 viên)', 11, NULL, NULL, 0, '../assets/AnhHangHoa/69.png', 1),
(70, 18, 'MuscleTech Platinum Creatine (400g)', 12, NULL, NULL, 0, '../assets/AnhHangHoa/70.png', 1),
(71, 18, 'MuscleTech Vapor X5 Pre-Workout (232g)', 12, NULL, NULL, 0, '../assets/AnhHangHoa/71.png', 1),
(72, 18, 'BSN NO-Xplode Pre-Workout (600g)', 13, NULL, NULL, 0, '../assets/AnhHangHoa/72.png', 1),
(73, 18, 'BSN Amino X Recovery (435g)', 13, NULL, NULL, 0, '../assets/AnhHangHoa/73.png', 1),
(74, 19, 'Dây kháng lực Yasu vải Poliamide 3609 (50lb)', 17, NULL, NULL, 0, '../assets/AnhHangHoa/74.png', 1),
(75, 19, 'Dây kháng lực Aolikes tập cơ mông đùi A-3603 chính', 18, NULL, NULL, 0, '../assets/AnhHangHoa/75.png', 1),
(76, 19, 'Bộ 6 dây kháng lực Aolikes A-3601 chính hãng', 18, NULL, NULL, 0, '../assets/AnhHangHoa/76.png', 1),
(77, 19, 'Dây kháng lực toàn thân Yasu 3610 (50-80lb)', 17, NULL, NULL, 0, '../assets/AnhHangHoa/77.png', 1),
(78, 19, 'Dây kháng lực Yasu vải Poliamide 3609 (15lb)', 17, NULL, NULL, 0, '../assets/AnhHangHoa/78.png', 1),
(79, 20, 'Xà đơn treo tường Kingsport X1', 14, NULL, NULL, 12, '../assets/AnhHangHoa/79.png', 1),
(80, 20, 'Xà đơn gắn cửa Xiaomi FED-X', 15, NULL, NULL, 12, '../assets/AnhHangHoa/80.png', 1),
(81, 20, 'Xà đơn đa năng Động Lực DL-3000', 16, NULL, NULL, 12, '../assets/AnhHangHoa/81.png', 1),
(82, 21, 'Máy xà kép BoFit K03', 1, NULL, NULL, 12, '../assets/AnhHangHoa/82.png', 1),
(83, 21, 'Xà kép điều chỉnh độ cao Xiaomi FED-Dip', 15, NULL, NULL, 12, '../assets/AnhHangHoa/83.png', 1),
(84, 21, 'Xà kép chịu lực cao Động Lực DL-5000', 16, NULL, NULL, 12, '../assets/AnhHangHoa/84.png', 1),
(85, 22, 'Kingsport X-Force Bench', 14, NULL, 'Ghế tập tạ đa năng, khung thép chịu lực', 12, '../assets/AnhHangHoa/85.png', 1),
(86, 22, 'Xiaomi FED Pro Bench', 15, NULL, 'Ghế tập gym gấp gọn, đệm êm ái', 12, '../assets/AnhHangHoa/86.png', 1),
(87, 22, 'Reebok Adjustable Bench', 8, NULL, 'Ghế tập tạ điều chỉnh độ nghiêng', 18, '../assets/AnhHangHoa/87.png', 1),
(88, 23, 'Nike Speed Rope', 2, NULL, 'Dây nhảy tốc độ cao, tay cầm chống trượt', 6, '../assets/AnhHangHoa/88.png', 1),
(89, 23, 'Adidas Adjustable Jump Rope', 3, NULL, 'Dây nhảy có thể điều chỉnh độ dài', 6, '../assets/AnhHangHoa/89.png', 1),
(90, 23, 'Kingsport Pro Jump Rope', 14, NULL, 'Dây nhảy thể lực có vòng bi giúp quay mượt', 12, '../assets/AnhHangHoa/90.png', 1),
(91, 7, 'Máy chạy bộ cơ 1 chức năng Royal 212', 19, NULL, 'Máy chạy bộ cơ Royal 212 là dòng máy chạy bộ thích hợp cho những người có sức khỏe tốt, dẻo dai; được thiết kế riêng cho việc tập chạy bộ ở gia đình.', 24, '/public/assets/AnhHangHoa/91_1746667810.jpg', 1),
(92, 7, 'Máy chạy bộ cơ đa năng Royal 512', 19, NULL, ' Máy chạy bộ cơ Royal 512 được cải tiến từ máy chạy bộ cơ Royal 412 có thêm chức năng đạp xe, thích hợp cho nhiều người trong gia đình cùng tập một lúc.', 24, '../assets/AnhHangHoa/92.png', 1),
(93, 7, 'Máy chạy bộ đa năng Royal 411', 19, NULL, ' Máy chạy bộ cơ đa năng Royal 411 bao gồm 4 chức năng chính: Chạy bộ, massage, xoay eo, tập bụng, đáp ứng mọi nhu cầu tập thể thao tại nhà.\r\n', 24, '../assets/AnhHangHoa/93.png', 1),
(94, 8, 'Máy chạy bộ gấp gọn Kingsmith MC11', 20, NULL, 'Máy chạy bộ gấp gọn Kingsmith MC11 là một người bạn đồng hành lý tưởng trong hành trình rèn luyện sức khỏe ngay tại không gian yên tĩnh của ngôi nhà bạn.', 24, '/public/assets/AnhHangHoa/94_1746667847.jpg', 1),
(95, 8, 'Máy Chạy Bộ Gấp Gọn KingSmith MX16', 20, NULL, 'KingSmith MX16 là dòng máy chạy bộ gấp gọn thông minh mới nhất đến từ thương hiệu KingSmith.', 24, '/public/assets/AnhHangHoa/95_1746667860.jpg', 1),
(96, 9, 'Máy Chạy Bộ KingSport GEN02\n', 14, NULL, 'KingSport GEN02 là sở hữu giao diện tinh gọn và đáp ứng rất tốt nhu cầu tập luyện của nhiều đối tượng khác nhau, đặc biệt nhất chính là dân văn phòng.', 24, '../assets/AnhHangHoa/96.png', 1),
(97, 9, 'Máy chạy bộ Kingsport Plus K-04 Đơn năng', 14, NULL, 'Máy chạy bộ Kingsport Plus K-04 Đơn năng', 24, '../assets/AnhHangHoa/97.png', 1),
(98, 9, 'Máy chạy bộ Kingsport BK-2037 đa năng', 14, NULL, 'Máy chạy bộ Kingsport BK-2037 đa năng\r\n', 24, '../assets/AnhHangHoa/98.png', 1),
(99, 10, 'Máy chèo thuyền tự tạo năng lượng 500B', 21, NULL, 'Bạn muốn tập trước cửa sổ (hay TV) nhưng không có ổ điện gần đó? Không cần ổ cắm: Bảng điều khiển của máy 500B được cung cấp năng lượng bằng chuyển động của bạn.', 24, '/public/assets/AnhHangHoa/99_1746667716.jpg', 1),
(100, 10, 'Máy tập chèo thuyền tự động thông minh gấp gọn', 21, NULL, 'Sự lựa chọn hoàn hảo cho các buổi tập! Máy tập tự động (không cần dây nguồn) tiện lợi, có khả năng kết nối và gấp gọn thành ghế tập tạ hoặc ghế dự phòng. Bảo hành 5 năm đối với mọi bộ phận sản phẩm.', 24, '/public/assets/AnhHangHoa/100_1746667740.jpg', 1),
(101, 11, 'Máy tập leo thang Tiger Sport TM-X200B', 22, NULL, 'Máy tập leo thang Tiger Sport TM-X200B là một thiết bị tập luyện đa chức năng với nhiều tính năng giúp nâng cao sức khỏe và sức mạnh cơ bắp.', 24, '../assets/AnhHangHoa/101.png', 1),
(102, 11, 'Máy leo cầu thang CS800', 22, NULL, 'CS800 Stepper kết hợp động tác bước phụ thuộc quen thuộc với thiết kế bậc thang hình vòm và chiều cao bậc thang tối đa 16 ”ấn tượng để tập luyện phần thân dưới hiệu quả.', 24, '../assets/AnhHangHoa/102.png', 1),
(103, 1, '123', 18, 1, 'ắdsd', NULL, 'blob:http://localhost:5173/33dbff4b-4fbf-4b3a-8d5e-caa652c52983', 0),
(104, 1, 'abc', 18, 1, NULL, 23, NULL, 0),
(105, 26, 'Nike Vomero 18', 2, NULL, 'Nike Vomero 18', 24, '/public/assets/AnhHangHoa/105_1746635606.png', 1),
(106, 27, 'adidas X Crazyfast.1 Laceless Soft Ground Boots', 3, 2, 'adidas X Crazyfast.1 Laceless Soft Ground Boots', 24, '/public/assets/AnhHangHoa/106_1746635761.jpg', 1),
(107, 26, 'Adidas Alphabounce Em Sneakers', 3, NULL, 'Adidas Alphabounce Em Sneakers', 24, '/public/assets/AnhHangHoa/107_1746636120.jpg', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

CREATE TABLE `hoadon` (
  `MaHoaDon` int(11) NOT NULL,
  `IDTaiKhoan` int(11) DEFAULT NULL,
  `NgayXuatHoaDon` date DEFAULT NULL,
  `NgayDuyet` date DEFAULT NULL,
  `TrangThai` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `DiaChi` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `TenNguoiMua` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `SoDienThoai` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `HinhThucThanhToan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khohang`
--

CREATE TABLE `khohang` (
  `Seri` int(11) NOT NULL,
  `TinhTrang` varchar(20) NOT NULL,
  `IDChiTietPhieuNhap` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khohang`
--

INSERT INTO `khohang` (`Seri`, `TinhTrang`, `IDChiTietPhieuNhap`) VALUES
(120, 'Chưa bán', 66),
(121, 'Chưa bán', 66),
(122, 'Chưa bán', 66),
(123, 'Chưa bán', 66),
(124, 'Chưa bán', 66),
(125, 'Chưa bán', 66),
(126, 'Chưa bán', 66),
(127, 'Chưa bán', 66),
(128, 'Chưa bán', 66),
(129, 'Chưa bán', 66),
(130, 'Chưa bán', 65),
(131, 'Chưa bán', 65),
(132, 'Chưa bán', 65),
(133, 'Chưa bán', 65),
(134, 'Chưa bán', 65),
(135, 'Chưa bán', 65),
(136, 'Chưa bán', 65),
(137, 'Chưa bán', 65),
(138, 'Chưa bán', 65),
(139, 'Chưa bán', 65),
(140, 'Chưa bán', 64),
(141, 'Chưa bán', 64),
(142, 'Chưa bán', 64),
(143, 'Chưa bán', 64),
(144, 'Chưa bán', 64),
(145, 'Chưa bán', 64),
(146, 'Chưa bán', 64),
(147, 'Chưa bán', 64),
(148, 'Chưa bán', 64),
(149, 'Chưa bán', 64),
(150, 'Chưa bán', 63),
(151, 'Chưa bán', 63),
(152, 'Chưa bán', 63),
(153, 'Chưa bán', 63),
(154, 'Chưa bán', 63),
(155, 'Chưa bán', 63),
(156, 'Chưa bán', 63),
(157, 'Chưa bán', 63),
(158, 'Chưa bán', 63),
(159, 'Chưa bán', 63),
(160, 'Chưa bán', 62),
(161, 'Chưa bán', 62),
(162, 'Chưa bán', 62),
(163, 'Chưa bán', 62),
(164, 'Chưa bán', 62),
(165, 'Chưa bán', 62),
(166, 'Chưa bán', 62),
(167, 'Chưa bán', 62),
(168, 'Chưa bán', 62),
(169, 'Chưa bán', 62),
(170, 'Chưa bán', 61),
(171, 'Chưa bán', 61),
(172, 'Chưa bán', 61),
(173, 'Chưa bán', 61),
(174, 'Chưa bán', 61),
(175, 'Chưa bán', 61),
(176, 'Chưa bán', 61),
(177, 'Chưa bán', 61),
(178, 'Chưa bán', 61),
(179, 'Chưa bán', 61),
(180, 'Chưa bán', 60),
(181, 'Chưa bán', 60),
(182, 'Chưa bán', 60),
(183, 'Chưa bán', 60),
(184, 'Chưa bán', 60),
(185, 'Chưa bán', 60),
(186, 'Chưa bán', 60),
(187, 'Chưa bán', 60),
(188, 'Chưa bán', 60),
(189, 'Chưa bán', 60),
(190, 'Chưa bán', 59),
(191, 'Chưa bán', 59),
(192, 'Chưa bán', 59),
(193, 'Chưa bán', 59),
(194, 'Chưa bán', 59),
(195, 'Chưa bán', 59),
(196, 'Chưa bán', 59),
(197, 'Chưa bán', 59),
(198, 'Chưa bán', 59),
(199, 'Chưa bán', 59),
(200, 'Chưa bán', 58),
(201, 'Chưa bán', 58),
(202, 'Chưa bán', 57),
(203, 'Chưa bán', 57),
(204, 'Chưa bán', 56),
(205, 'Chưa bán', 56),
(206, 'Chưa bán', 56),
(207, 'Chưa bán', 56),
(208, 'Chưa bán', 56),
(209, 'Chưa bán', 56),
(210, 'Chưa bán', 56),
(211, 'Chưa bán', 56),
(212, 'Chưa bán', 56),
(213, 'Chưa bán', 56),
(214, 'Chưa bán', 56),
(215, 'Chưa bán', 56),
(216, 'Chưa bán', 56),
(217, 'Chưa bán', 56),
(218, 'Chưa bán', 56),
(219, 'Chưa bán', 56),
(220, 'Chưa bán', 56),
(221, 'Chưa bán', 56),
(222, 'Chưa bán', 56),
(223, 'Chưa bán', 56),
(224, 'Chưa bán', 56),
(225, 'Chưa bán', 56),
(226, 'Chưa bán', 56),
(227, 'Chưa bán', 56),
(228, 'Chưa bán', 56),
(229, 'Chưa bán', 56),
(230, 'Chưa bán', 56),
(231, 'Chưa bán', 56),
(232, 'Chưa bán', 56),
(233, 'Chưa bán', 56),
(234, 'Chưa bán', 56),
(235, 'Chưa bán', 56),
(236, 'Chưa bán', 56),
(237, 'Chưa bán', 56),
(238, 'Chưa bán', 56),
(239, 'Chưa bán', 56),
(240, 'Chưa bán', 56),
(241, 'Chưa bán', 56),
(242, 'Chưa bán', 56),
(243, 'Chưa bán', 56),
(244, 'Chưa bán', 56),
(245, 'Chưa bán', 56),
(246, 'Chưa bán', 56),
(247, 'Chưa bán', 56),
(248, 'Chưa bán', 56),
(249, 'Chưa bán', 56),
(250, 'Chưa bán', 56),
(251, 'Chưa bán', 56),
(252, 'Chưa bán', 56),
(253, 'Chưa bán', 56),
(254, 'Chưa bán', 55),
(255, 'Chưa bán', 55),
(256, 'Chưa bán', 55),
(257, 'Chưa bán', 55),
(258, 'Chưa bán', 55),
(259, 'Chưa bán', 55),
(260, 'Chưa bán', 55),
(261, 'Chưa bán', 55),
(262, 'Chưa bán', 55),
(263, 'Chưa bán', 55),
(264, 'Chưa bán', 55),
(265, 'Chưa bán', 55),
(266, 'Chưa bán', 55),
(267, 'Chưa bán', 55),
(268, 'Chưa bán', 55),
(269, 'Chưa bán', 54),
(270, 'Chưa bán', 54),
(271, 'Chưa bán', 54),
(272, 'Chưa bán', 54),
(273, 'Chưa bán', 54),
(274, 'Chưa bán', 54),
(275, 'Chưa bán', 54),
(276, 'Chưa bán', 54),
(277, 'Chưa bán', 54),
(278, 'Chưa bán', 54),
(279, 'Chưa bán', 54),
(280, 'Chưa bán', 54),
(281, 'Chưa bán', 54),
(282, 'Chưa bán', 54),
(283, 'Chưa bán', 54),
(284, 'Chưa bán', 53),
(285, 'Chưa bán', 53),
(286, 'Chưa bán', 53),
(287, 'Chưa bán', 53),
(288, 'Chưa bán', 53),
(289, 'Chưa bán', 53),
(290, 'Chưa bán', 53),
(291, 'Chưa bán', 53),
(292, 'Chưa bán', 53),
(293, 'Chưa bán', 53),
(294, 'Chưa bán', 53),
(295, 'Chưa bán', 53),
(296, 'Chưa bán', 53),
(297, 'Chưa bán', 53),
(298, 'Chưa bán', 53),
(299, 'Chưa bán', 53),
(300, 'Chưa bán', 53),
(301, 'Chưa bán', 53),
(302, 'Chưa bán', 53),
(303, 'Chưa bán', 53),
(304, 'Chưa bán', 52),
(305, 'Chưa bán', 52),
(306, 'Chưa bán', 52),
(307, 'Chưa bán', 52),
(308, 'Chưa bán', 52),
(309, 'Chưa bán', 52),
(310, 'Chưa bán', 52),
(311, 'Chưa bán', 52),
(312, 'Chưa bán', 52),
(313, 'Chưa bán', 52),
(314, 'Chưa bán', 52),
(315, 'Chưa bán', 52),
(316, 'Chưa bán', 52),
(317, 'Chưa bán', 52),
(318, 'Chưa bán', 52),
(319, 'Chưa bán', 52),
(320, 'Chưa bán', 52),
(321, 'Chưa bán', 52),
(322, 'Chưa bán', 52),
(323, 'Chưa bán', 52),
(324, 'Chưa bán', 51),
(325, 'Chưa bán', 51),
(326, 'Chưa bán', 51),
(327, 'Chưa bán', 51),
(328, 'Chưa bán', 51),
(329, 'Chưa bán', 51),
(330, 'Chưa bán', 51),
(331, 'Chưa bán', 51),
(332, 'Chưa bán', 51),
(333, 'Chưa bán', 51),
(334, 'Chưa bán', 51),
(335, 'Chưa bán', 51),
(336, 'Chưa bán', 51),
(337, 'Chưa bán', 51),
(338, 'Chưa bán', 51),
(339, 'Chưa bán', 51),
(340, 'Chưa bán', 51),
(341, 'Chưa bán', 51),
(342, 'Chưa bán', 51),
(343, 'Chưa bán', 51),
(344, 'Chưa bán', 50),
(345, 'Chưa bán', 50),
(346, 'Chưa bán', 50),
(347, 'Chưa bán', 50),
(348, 'Chưa bán', 50),
(349, 'Chưa bán', 50),
(350, 'Chưa bán', 50),
(351, 'Chưa bán', 50),
(352, 'Chưa bán', 50),
(353, 'Chưa bán', 50),
(354, 'Chưa bán', 50),
(355, 'Chưa bán', 50),
(356, 'Chưa bán', 50),
(357, 'Chưa bán', 50),
(358, 'Chưa bán', 50),
(359, 'Chưa bán', 50),
(360, 'Chưa bán', 50),
(361, 'Chưa bán', 50),
(362, 'Chưa bán', 50),
(363, 'Chưa bán', 50),
(364, 'Chưa bán', 49),
(365, 'Chưa bán', 49),
(366, 'Chưa bán', 49),
(367, 'Chưa bán', 48),
(368, 'Chưa bán', 48),
(369, 'Chưa bán', 48),
(370, 'Chưa bán', 47),
(371, 'Chưa bán', 47),
(372, 'Chưa bán', 47),
(373, 'Chưa bán', 46),
(374, 'Chưa bán', 46),
(375, 'Chưa bán', 46),
(376, 'Chưa bán', 45),
(377, 'Chưa bán', 45),
(378, 'Chưa bán', 45),
(379, 'Chưa bán', 45),
(380, 'Chưa bán', 45),
(381, 'Chưa bán', 44),
(382, 'Chưa bán', 44),
(383, 'Chưa bán', 44),
(384, 'Chưa bán', 44),
(385, 'Chưa bán', 44),
(386, 'Chưa bán', 43),
(387, 'Chưa bán', 43),
(388, 'Chưa bán', 43),
(389, 'Chưa bán', 43),
(390, 'Chưa bán', 43),
(391, 'Chưa bán', 42),
(392, 'Chưa bán', 42),
(393, 'Chưa bán', 42),
(394, 'Chưa bán', 42),
(395, 'Chưa bán', 42),
(396, 'Chưa bán', 42),
(397, 'Chưa bán', 42),
(398, 'Chưa bán', 42),
(399, 'Chưa bán', 42),
(400, 'Chưa bán', 42),
(401, 'Chưa bán', 41),
(402, 'Chưa bán', 41),
(403, 'Chưa bán', 41),
(404, 'Chưa bán', 41),
(405, 'Chưa bán', 41),
(406, 'Chưa bán', 41),
(407, 'Chưa bán', 41),
(408, 'Chưa bán', 41),
(409, 'Chưa bán', 41),
(410, 'Chưa bán', 41);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khoiluongta`
--

CREATE TABLE `khoiluongta` (
  `IDKhoiLuongTa` int(11) NOT NULL,
  `KhoiLuong` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khoiluongta`
--

INSERT INTO `khoiluongta` (`IDKhoiLuongTa`, `KhoiLuong`) VALUES
(0, 0),
(1, 1),
(2, 2),
(3, 2.5),
(4, 3),
(5, 4),
(6, 5),
(7, 7.5),
(8, 10),
(9, 12.5),
(10, 15),
(11, 17.5),
(12, 20),
(13, 25),
(14, 30),
(15, 35);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khuyenmai`
--

CREATE TABLE `khuyenmai` (
  `MaKhuyenMai` int(11) NOT NULL,
  `TenKhuyenMai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MoTaKhuyenMai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `PhanTram` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khuyenmai`
--

INSERT INTO `khuyenmai` (`MaKhuyenMai`, `TenKhuyenMai`, `MoTaKhuyenMai`, `PhanTram`) VALUES
(1, 'Giảm giá Tết Nguyên Đán', 'Giảm 30%', 30.00),
(2, 'Khuyến mãi 30/4 - 1/5', 'Giảm 20%', 20.00),
(3, 'Ưu đãi Quốc Khánh 2/9', 'Giảm 25%', 25.00),
(4, 'Giảm giá Giáng Sinh', 'Giảm 35%', 35.00),
(5, 'Khuyến mãi Black Friday', 'Giảm 50%', 50.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kichthuocgiay`
--

CREATE TABLE `kichthuocgiay` (
  `IDKichThuocGiay` int(11) NOT NULL,
  `KichThuocGiay` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `kichthuocgiay`
--

INSERT INTO `kichthuocgiay` (`IDKichThuocGiay`, `KichThuocGiay`) VALUES
(0, 0),
(1, 35),
(2, 36),
(3, 37),
(4, 38),
(5, 39),
(6, 40),
(7, 41),
(8, 42),
(9, 43),
(10, 44),
(11, 45);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kichthuocquanao`
--

CREATE TABLE `kichthuocquanao` (
  `IDKichThuocQuanAo` int(11) NOT NULL,
  `KichThuocQuanAo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `kichthuocquanao`
--

INSERT INTO `kichthuocquanao` (`IDKichThuocQuanAo`, `KichThuocQuanAo`) VALUES
(0, '0'),
(3, 'L'),
(2, 'M'),
(1, 'S'),
(4, 'XL'),
(5, 'XXL');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

CREATE TABLE `nguoidung` (
  `MaNguoiDung` int(11) NOT NULL,
  `HoTen` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `GioiTinh` varchar(3) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `SoDienThoai` char(10) DEFAULT NULL,
  `IDTaiKhoan` int(11) DEFAULT NULL,
  `Anh` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`MaNguoiDung`, `HoTen`, `GioiTinh`, `Email`, `SoDienThoai`, `IDTaiKhoan`, `Anh`) VALUES
(1, 'Người dùng 1', 'Nam', 'nd1@gmail.com', '09000000', 1, NULL),
(2, 'Nguyên tuấn', 'Nam', 'nguyentuan06@gmail.com', '0903316095', 3, NULL),
(3, 'Nguyễn Minh Tuấn', 'Nam', 'nguyentuan@gmail.com', '0397284705', 4, NULL),
(4, 'tongthanhdat145', 'Nam', 'a0041405@gmail.com', '0395632027', 5, '1746623171_R.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhacungcap`
--

CREATE TABLE `nhacungcap` (
  `MaNhaCungCap` int(11) NOT NULL,
  `TenNhaCungCap` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhacungcap`
--

INSERT INTO `nhacungcap` (`MaNhaCungCap`, `TenNhaCungCap`) VALUES
(1, 'Công Ty TNHH Thể Thao VN'),
(2, 'SportGear Co. Ltd'),
(3, 'Fitness Pro Supply'),
(4, 'Công Ty CP Dụng Cụ Gym'),
(5, 'Premium Sport Equipment');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvien`
--

CREATE TABLE `nhanvien` (
  `MaNguoiDung` int(11) NOT NULL,
  `NgaySinh` date DEFAULT NULL,
  `Luong` decimal(18,2) DEFAULT NULL,
  `CCCD` char(12) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phanquyen`
--

CREATE TABLE `phanquyen` (
  `IDChucNang` int(11) NOT NULL,
  `IDQuyen` int(11) NOT NULL,
  `Them` tinyint(4) DEFAULT NULL,
  `Xoa` tinyint(4) DEFAULT NULL,
  `Sua` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phanquyen`
--

INSERT INTO `phanquyen` (`IDChucNang`, `IDQuyen`, `Them`, `Xoa`, `Sua`) VALUES
(1, 1, 1, 1, 1),
(1, 3, 1, 1, 1),
(2, 1, NULL, NULL, NULL),
(3, 1, 1, NULL, NULL),
(3, 3, 1, NULL, NULL),
(4, 1, 1, 1, 1),
(4, 3, 1, 1, 1),
(5, 1, 1, 1, 1),
(5, 3, 1, 1, 1),
(6, 1, NULL, NULL, NULL),
(6, 3, NULL, NULL, NULL),
(7, 1, 1, 1, 1),
(7, 3, 1, 1, 1),
(8, 1, 1, 1, 1),
(8, 3, 1, 1, 1),
(9, 1, 1, 1, 1),
(10, 1, 1, 1, 1),
(11, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieunhap`
--

CREATE TABLE `phieunhap` (
  `MaPhieuNhap` int(11) NOT NULL,
  `TrangThai` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IDTaiKhoan` int(11) DEFAULT NULL,
  `MaNhaCungCap` int(11) DEFAULT NULL,
  `NgayNhap` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phieunhap`
--

INSERT INTO `phieunhap` (`MaPhieuNhap`, `TrangThai`, `IDTaiKhoan`, `MaNhaCungCap`, `NgayNhap`) VALUES
(48, 'Đã duyệt', 1, 1, '2025-05-08 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quyen`
--

CREATE TABLE `quyen` (
  `IDQuyen` int(11) NOT NULL,
  `TenQuyen` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `quyen`
--

INSERT INTO `quyen` (`IDQuyen`, `TenQuyen`) VALUES
(1, 'Admin'),
(2, 'Khách hàng'),
(3, 'Nhân viên');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `IDTaiKhoan` int(11) NOT NULL,
  `TaiKhoan` char(20) DEFAULT NULL,
  `matKhau` varbinary(64) DEFAULT NULL,
  `IDQuyen` int(11) DEFAULT NULL,
  `TrangThai` tinyint(1) NOT NULL DEFAULT 0,
  `HoatDong` int(11) NOT NULL,
  `SessionID` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`IDTaiKhoan`, `TaiKhoan`, `matKhau`, `IDQuyen`, `TrangThai`, `HoatDong`, `SessionID`) VALUES
(1, 'admin', 0x5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5, 1, 0, 1, ''),
(3, 'tuanminhtuan123', 0x2432792431302444585933594d736b3577316370337a6c59436a69704f367345765449716b6e5873654f4e7634587278573548626854574c6e656d79, 2, 1, 0, NULL),
(4, 'nguyeminhtuan123', 0x243279243130246e76465851476558392e57576871554f3774633257654c45466c73324d324c6a3757584257374b456e6b724e2f35524c4a32346836, 2, 1, 0, NULL),
(5, 'tongthanhdat145', 0x243279243130244c6e3670585a7672636f4130774a73566b6e45674b4f45516b725a65454a6d3874626f6b7766772e457659336a435036546b663379, 2, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theloai`
--

CREATE TABLE `theloai` (
  `MaTheLoai` int(11) NOT NULL,
  `TenTheLoai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `theloai`
--

INSERT INTO `theloai` (`MaTheLoai`, `TenTheLoai`) VALUES
(1, 'Các thiết bị tạ'),
(2, 'Thiết bị cardio'),
(3, 'Thời trang thể thao'),
(4, 'Thực phẩm bổ sung'),
(5, 'Dụng cụ khác'),
(6, 'Giày thể thao');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD KEY `FK_ChiTietHoaDon_KhoHang` (`Seri`),
  ADD KEY `FK_ChiTietHoaDon_HoaDon1` (`MaHoaDon`);

--
-- Chỉ mục cho bảng `chitietphieunhap`
--
ALTER TABLE `chitietphieunhap`
  ADD PRIMARY KEY (`IDChiTietPhieuNhap`),
  ADD KEY `FK_ChiTietPhieuNhap_PhieuNhap` (`MaPhieuNhap`),
  ADD KEY `FK_ChiTietPhieuNhap_KhoiLuongTa` (`IDKhoiLuongTa`),
  ADD KEY `FK_ChiTietPhieuNhap_KichThuocQuanAo` (`IDKichThuocQuanAo`),
  ADD KEY `FK_ChiTietPhieuNhap_KichThuocGiay` (`IDKichThuocGiay`),
  ADD KEY `FK_ChiTietPhieuNhap_HangHoa` (`MaHangHoa`);

--
-- Chỉ mục cho bảng `chucnang`
--
ALTER TABLE `chucnang`
  ADD PRIMARY KEY (`IDChucNang`);

--
-- Chỉ mục cho bảng `chungloai`
--
ALTER TABLE `chungloai`
  ADD PRIMARY KEY (`MaChungLoai`),
  ADD KEY `FK_ChungLoai_TheLoai` (`MaTheLoai`);

--
-- Chỉ mục cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD PRIMARY KEY (`IDTaiKhoan`,`MaHangHoa`,`IDKhoiLuongTa`,`IDKichThuocQuanAo`,`IDKichThuocGiay`),
  ADD KEY `fk_giohang_hanghoa` (`MaHangHoa`),
  ADD KEY `fk_giohang_khoiluongta` (`IDKhoiLuongTa`),
  ADD KEY `fk_giohang_kichthuocquanao` (`IDKichThuocQuanAo`),
  ADD KEY `fk_giohang_kichthuocgiay` (`IDKichThuocGiay`);

--
-- Chỉ mục cho bảng `hang`
--
ALTER TABLE `hang`
  ADD PRIMARY KEY (`MaHang`);

--
-- Chỉ mục cho bảng `hanghoa`
--
ALTER TABLE `hanghoa`
  ADD PRIMARY KEY (`MaHangHoa`),
  ADD KEY `FK_HangHoa_ChungLoai` (`MaChungLoai`),
  ADD KEY `FK_HangHoa_Hang` (`MaHang`),
  ADD KEY `FK_HangHoa_KhuyenMai1` (`MaKhuyenMai`);

--
-- Chỉ mục cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`MaHoaDon`),
  ADD KEY `FK_HoaDon_TaiKhoan1` (`IDTaiKhoan`);

--
-- Chỉ mục cho bảng `khohang`
--
ALTER TABLE `khohang`
  ADD PRIMARY KEY (`Seri`),
  ADD KEY `FK_KhoHang_ChiTietPhieuNhap` (`IDChiTietPhieuNhap`);

--
-- Chỉ mục cho bảng `khoiluongta`
--
ALTER TABLE `khoiluongta`
  ADD PRIMARY KEY (`IDKhoiLuongTa`),
  ADD UNIQUE KEY `KhoiLuong` (`KhoiLuong`);

--
-- Chỉ mục cho bảng `khuyenmai`
--
ALTER TABLE `khuyenmai`
  ADD PRIMARY KEY (`MaKhuyenMai`);

--
-- Chỉ mục cho bảng `kichthuocgiay`
--
ALTER TABLE `kichthuocgiay`
  ADD PRIMARY KEY (`IDKichThuocGiay`),
  ADD UNIQUE KEY `KichThuoc` (`KichThuocGiay`);

--
-- Chỉ mục cho bảng `kichthuocquanao`
--
ALTER TABLE `kichthuocquanao`
  ADD PRIMARY KEY (`IDKichThuocQuanAo`),
  ADD UNIQUE KEY `KichThuoc` (`KichThuocQuanAo`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`MaNguoiDung`),
  ADD KEY `FK_HoiVien_TaiKhoan1` (`IDTaiKhoan`);

--
-- Chỉ mục cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD PRIMARY KEY (`MaNhaCungCap`),
  ADD UNIQUE KEY `MaNhaCungCap` (`MaNhaCungCap`);

--
-- Chỉ mục cho bảng `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`MaNguoiDung`);

--
-- Chỉ mục cho bảng `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD PRIMARY KEY (`IDChucNang`,`IDQuyen`),
  ADD KEY `FK_PhanQuyen_Quyen1` (`IDQuyen`);

--
-- Chỉ mục cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD PRIMARY KEY (`MaPhieuNhap`),
  ADD KEY `FK_PhieuNhap_NhaCungCap` (`MaNhaCungCap`),
  ADD KEY `FK_PhieuNhap_TaiKhoan` (`IDTaiKhoan`);

--
-- Chỉ mục cho bảng `quyen`
--
ALTER TABLE `quyen`
  ADD PRIMARY KEY (`IDQuyen`),
  ADD UNIQUE KEY `TenQuyen` (`TenQuyen`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`IDTaiKhoan`),
  ADD KEY `FK_TaiKhoan_Quyen` (`IDQuyen`);

--
-- Chỉ mục cho bảng `theloai`
--
ALTER TABLE `theloai`
  ADD PRIMARY KEY (`MaTheLoai`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chitietphieunhap`
--
ALTER TABLE `chitietphieunhap`
  MODIFY `IDChiTietPhieuNhap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT cho bảng `chucnang`
--
ALTER TABLE `chucnang`
  MODIFY `IDChucNang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `chungloai`
--
ALTER TABLE `chungloai`
  MODIFY `MaChungLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `hang`
--
ALTER TABLE `hang`
  MODIFY `MaHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `hanghoa`
--
ALTER TABLE `hanghoa`
  MODIFY `MaHangHoa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  MODIFY `MaHoaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `khohang`
--
ALTER TABLE `khohang`
  MODIFY `Seri` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=411;

--
-- AUTO_INCREMENT cho bảng `khoiluongta`
--
ALTER TABLE `khoiluongta`
  MODIFY `IDKhoiLuongTa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `khuyenmai`
--
ALTER TABLE `khuyenmai`
  MODIFY `MaKhuyenMai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `kichthuocgiay`
--
ALTER TABLE `kichthuocgiay`
  MODIFY `IDKichThuocGiay` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `kichthuocquanao`
--
ALTER TABLE `kichthuocquanao`
  MODIFY `IDKichThuocQuanAo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `MaNguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  MODIFY `MaNhaCungCap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  MODIFY `MaPhieuNhap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT cho bảng `quyen`
--
ALTER TABLE `quyen`
  MODIFY `IDQuyen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `IDTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `theloai`
--
ALTER TABLE `theloai`
  MODIFY `MaTheLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD CONSTRAINT `FK_ChiTietHoaDon_HoaDon1` FOREIGN KEY (`MaHoaDon`) REFERENCES `hoadon` (`MaHoaDon`),
  ADD CONSTRAINT `FK_ChiTietHoaDon_KhoHang` FOREIGN KEY (`Seri`) REFERENCES `khohang` (`Seri`);

--
-- Các ràng buộc cho bảng `chitietphieunhap`
--
ALTER TABLE `chitietphieunhap`
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_HangHoa` FOREIGN KEY (`MaHangHoa`) REFERENCES `hanghoa` (`MaHangHoa`),
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_KhoiLuongTa` FOREIGN KEY (`IDKhoiLuongTa`) REFERENCES `khoiluongta` (`IDKhoiLuongTa`),
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_KichThuocGiay` FOREIGN KEY (`IDKichThuocGiay`) REFERENCES `kichthuocgiay` (`IDKichThuocGiay`),
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_KichThuocQuanAo` FOREIGN KEY (`IDKichThuocQuanAo`) REFERENCES `kichthuocquanao` (`IDKichThuocQuanAo`),
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_PhieuNhap` FOREIGN KEY (`MaPhieuNhap`) REFERENCES `phieunhap` (`MaPhieuNhap`);

--
-- Các ràng buộc cho bảng `chungloai`
--
ALTER TABLE `chungloai`
  ADD CONSTRAINT `FK_ChungLoai_TheLoai` FOREIGN KEY (`MaTheLoai`) REFERENCES `theloai` (`MaTheLoai`);

--
-- Các ràng buộc cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `fk_giohang_hanghoa` FOREIGN KEY (`MaHangHoa`) REFERENCES `hanghoa` (`MaHangHoa`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_giohang_khoiluongta` FOREIGN KEY (`IDKhoiLuongTa`) REFERENCES `khoiluongta` (`IDKhoiLuongTa`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_giohang_kichthuocgiay` FOREIGN KEY (`IDKichThuocGiay`) REFERENCES `kichthuocgiay` (`IDKichThuocGiay`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_giohang_kichthuocquanao` FOREIGN KEY (`IDKichThuocQuanAo`) REFERENCES `kichthuocquanao` (`IDKichThuocQuanAo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_giohang_taikhoan` FOREIGN KEY (`IDTaiKhoan`) REFERENCES `taikhoan` (`IDTaiKhoan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hanghoa`
--
ALTER TABLE `hanghoa`
  ADD CONSTRAINT `FK_HangHoa_ChungLoai` FOREIGN KEY (`MaChungLoai`) REFERENCES `chungloai` (`MaChungLoai`),
  ADD CONSTRAINT `FK_HangHoa_Hang` FOREIGN KEY (`MaHang`) REFERENCES `hang` (`MaHang`),
  ADD CONSTRAINT `FK_HangHoa_KhuyenMai1` FOREIGN KEY (`MaKhuyenMai`) REFERENCES `khuyenmai` (`MaKhuyenMai`);

--
-- Các ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `FK_HoaDon_TaiKhoan1` FOREIGN KEY (`IDTaiKhoan`) REFERENCES `taikhoan` (`IDTaiKhoan`);

--
-- Các ràng buộc cho bảng `khohang`
--
ALTER TABLE `khohang`
  ADD CONSTRAINT `FK_KhoHang_ChiTietPhieuNhap` FOREIGN KEY (`IDChiTietPhieuNhap`) REFERENCES `chitietphieunhap` (`IDChiTietPhieuNhap`);

--
-- Các ràng buộc cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD CONSTRAINT `FK_HoiVien_TaiKhoan1` FOREIGN KEY (`IDTaiKhoan`) REFERENCES `taikhoan` (`IDTaiKhoan`);

--
-- Các ràng buộc cho bảng `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD CONSTRAINT `FK_NhanVien_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`);

--
-- Các ràng buộc cho bảng `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD CONSTRAINT `FK_PhanQuyen_Quyen` FOREIGN KEY (`IDChucNang`) REFERENCES `chucnang` (`IDChucNang`),
  ADD CONSTRAINT `FK_PhanQuyen_Quyen1` FOREIGN KEY (`IDQuyen`) REFERENCES `quyen` (`IDQuyen`);

--
-- Các ràng buộc cho bảng `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD CONSTRAINT `FK_PhieuNhap_NhaCungCap` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `nhacungcap` (`MaNhaCungCap`),
  ADD CONSTRAINT `FK_PhieuNhap_TaiKhoan` FOREIGN KEY (`IDTaiKhoan`) REFERENCES `taikhoan` (`IDTaiKhoan`);

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `FK_TaiKhoan_Quyen` FOREIGN KEY (`IDQuyen`) REFERENCES `quyen` (`IDQuyen`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
