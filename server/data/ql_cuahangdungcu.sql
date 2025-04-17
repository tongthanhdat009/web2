-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2025 at 10:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ql_cuahangdungcu`
--

-- --------------------------------------------------------

--
-- Table structure for table `chitiethanghoa`
--

CREATE TABLE `chitiethanghoa` (
  `MaHangHoa` int(11) NOT NULL,
  `KhoiLuong` int(11) DEFAULT NULL,
  `TocDoToiDa` int(11) DEFAULT NULL,
  `CongSuat` float DEFAULT NULL,
  `TaiTrongToiDa` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitiethanghoa`
--

INSERT INTO `chitiethanghoa` (`MaHangHoa`, `KhoiLuong`, `TocDoToiDa`, `CongSuat`, `TaiTrongToiDa`) VALUES
(1, 3, NULL, 0, 0),
(2, 5, NULL, 0, 0),
(3, 8, NULL, 0, 0),
(4, 10, NULL, 0, 0),
(5, 15, NULL, 0, 0),
(6, 10, NULL, 0, 0),
(7, 10, NULL, 0, 0),
(8, 15, NULL, 0, 0),
(9, 15, NULL, 0, 0),
(10, 20, NULL, 0, 0),
(11, 20, NULL, 0, 0),
(12, 4, NULL, 0, 0),
(13, 6, NULL, 0, 0),
(14, 8, NULL, 0, 0),
(15, 10, NULL, 0, 0),
(16, 5, NULL, 0, 0),
(17, 10, NULL, 0, 0),
(18, 20, NULL, 0, 0),
(19, 32, NULL, 0, 0),
(20, NULL, NULL, 6, 155),
(21, NULL, NULL, 3, 250),
(79, NULL, NULL, NULL, 120),
(80, NULL, NULL, NULL, 150),
(81, NULL, NULL, NULL, 180),
(82, NULL, NULL, NULL, 200),
(83, NULL, NULL, NULL, 220),
(84, NULL, NULL, NULL, 250),
(94, NULL, 12, NULL, NULL),
(95, NULL, 16, NULL, NULL),
(96, NULL, 12, NULL, NULL),
(97, NULL, 14, NULL, NULL),
(98, NULL, 14, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chitiethoadon`
--

CREATE TABLE `chitiethoadon` (
  `MaHoaDon` int(11) NOT NULL,
  `Seri` int(11) DEFAULT NULL,
  `GiaBan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitiethoadon`
--

INSERT INTO `chitiethoadon` (`MaHoaDon`, `Seri`, `GiaBan`) VALUES
(1, 1, 200000),
(1, 2, 180000);

-- --------------------------------------------------------

--
-- Table structure for table `chucnang`
--

CREATE TABLE `chucnang` (
  `IDChucNang` int(11) NOT NULL,
  `TenChucNang` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chucnang`
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
-- Table structure for table `chungloai`
--

CREATE TABLE `chungloai` (
  `MaChungLoai` int(11) NOT NULL,
  `TenChungLoai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MaTheLoai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chungloai`
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
(25, 'Tạ tay', 1);

-- --------------------------------------------------------

--
-- Table structure for table `hang`
--

CREATE TABLE `hang` (
  `MaHang` int(11) NOT NULL,
  `TenHang` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hang`
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
-- Table structure for table `hanghoa`
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
-- Dumping data for table `hanghoa`
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
(22, 12, 'Áo Thun Nike Dri-FIT', 2, NULL, 'Áo Thun Nike Dri-FIT', 0, '../assets/AnhHangHoa/22.png', 1),
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
(91, 7, 'Máy chạy bộ cơ 1 chức năng Royal 212', 19, NULL, 'Máy chạy bộ cơ Royal 212 là dòng máy chạy bộ thích hợp cho những người có sức khỏe tốt, dẻo dai; được thiết kế riêng cho việc tập chạy bộ ở gia đình.\n', 24, '../assets/AnhHangHoa/91.png', 1),
(92, 7, 'Máy chạy bộ cơ đa năng Royal 512', 19, NULL, ' Máy chạy bộ cơ Royal 512 được cải tiến từ máy chạy bộ cơ Royal 412 có thêm chức năng đạp xe, thích hợp cho nhiều người trong gia đình cùng tập một lúc.', 24, '../assets/AnhHangHoa/92.png', 1),
(93, 7, 'Máy chạy bộ đa năng Royal 411', 19, NULL, ' Máy chạy bộ cơ đa năng Royal 411 bao gồm 4 chức năng chính: Chạy bộ, massage, xoay eo, tập bụng, đáp ứng mọi nhu cầu tập thể thao tại nhà.\r\n', 24, '../assets/AnhHangHoa/93.png', 1),
(94, 8, 'Máy chạy bộ gấp gọn Kingsmith MC11', 20, NULL, 'Máy chạy bộ gấp gọn Kingsmith MC11 là một người bạn đồng hành lý tưởng trong hành trình rèn luyện sức khỏe ngay tại không gian yên tĩnh của ngôi nhà bạn.', 24, '../assets/AnhHangHoa/94.png', 1),
(95, 8, 'Máy Chạy Bộ Gấp Gọn KingSmith MX16', 20, NULL, 'KingSmith MX16 là dòng máy chạy bộ gấp gọn thông minh mới nhất đến từ thương hiệu KingSmith.', 24, '../assets/AnhHangHoa/95.png', 1),
(96, 9, 'Máy Chạy Bộ KingSport GEN02\n', 14, NULL, 'KingSport GEN02 là sở hữu giao diện tinh gọn và đáp ứng rất tốt nhu cầu tập luyện của nhiều đối tượng khác nhau, đặc biệt nhất chính là dân văn phòng.', 24, '../assets/AnhHangHoa/96.png', 1),
(97, 9, 'Máy chạy bộ Kingsport Plus K-04 Đơn năng', 14, NULL, 'Máy chạy bộ Kingsport Plus K-04 Đơn năng', 24, '../assets/AnhHangHoa/97.png', 1),
(98, 9, 'Máy chạy bộ Kingsport BK-2037 đa năng', 14, NULL, 'Máy chạy bộ Kingsport BK-2037 đa năng\r\n', 24, '../assets/AnhHangHoa/98.png', 1),
(99, 10, 'Máy chèo thuyền tự tạo năng lượng 500B', 21, NULL, 'Bạn muốn tập trước cửa sổ (hay TV) nhưng không có ổ điện gần đó? Không cần ổ cắm: Bảng điều khiển của máy 500B được cung cấp năng lượng bằng chuyển động của bạn.', 24, '../assets/AnhHangHoa/99.png', 1),
(100, 10, 'Máy tập chèo thuyền tự động thông minh gấp gọn', 21, NULL, 'Sự lựa chọn hoàn hảo cho các buổi tập! Máy tập tự động (không cần dây nguồn) tiện lợi, có khả năng kết nối và gấp gọn thành ghế tập tạ hoặc ghế dự phòng. Bảo hành 5 năm đối với mọi bộ phận sản phẩm.', 24, '../assets/AnhHangHoa/100.png', 1),
(101, 11, 'Máy tập leo thang Tiger Sport TM-X200B', 22, NULL, 'Máy tập leo thang Tiger Sport TM-X200B là một thiết bị tập luyện đa chức năng với nhiều tính năng giúp nâng cao sức khỏe và sức mạnh cơ bắp.', 24, '../assets/AnhHangHoa/101.png', 1),
(102, 11, 'Máy leo cầu thang CS800', 22, NULL, 'CS800 Stepper kết hợp động tác bước phụ thuộc quen thuộc với thiết kế bậc thang hình vòm và chiều cao bậc thang tối đa 16 ”ấn tượng để tập luyện phần thân dưới hiệu quả.', 24, '../assets/AnhHangHoa/102.png', 1),
(103, 1, '123', 18, 1, 'ắdsd', NULL, 'blob:http://localhost:5173/33dbff4b-4fbf-4b3a-8d5e-caa652c52983', 0),
(104, 1, 'abc', 18, 1, NULL, 23, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `hoadon`
--

CREATE TABLE `hoadon` (
  `MaHoaDon` int(11) NOT NULL,
  `IDTaiKhoan` int(11) DEFAULT NULL,
  `NgayXuatHoaDon` date DEFAULT NULL,
  `NgayDuyet` date DEFAULT NULL,
  `TrangThai` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `DiaChi` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `TenNguoiMua` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `SoDienThoai` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hoadon`
--

INSERT INTO `hoadon` (`MaHoaDon`, `IDTaiKhoan`, `NgayXuatHoaDon`, `NgayDuyet`, `TrangThai`, `DiaChi`, `TenNguoiMua`, `SoDienThoai`) VALUES
(1, 1, '2024-04-12', '2024-04-12', '1', '123 Đường ABC, Quận 1, TP.HCM', 'Người Mua 1', '0901234567');

-- --------------------------------------------------------

--
-- Table structure for table `khohang`
--

CREATE TABLE `khohang` (
  `Seri` int(11) NOT NULL,
  `MaPhieuNhap` int(11) NOT NULL,
  `MaHangHoa` int(11) NOT NULL,
  `GiaNhap` int(11) DEFAULT NULL,
  `GiaBan` int(11) DEFAULT NULL,
  `TinhTrang` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khohang`
--

INSERT INTO `khohang` (`Seri`, `MaPhieuNhap`, `MaHangHoa`, `GiaNhap`, `GiaBan`, `TinhTrang`) VALUES
(1, 1, 1, 135000, 200000, 1),
(2, 1, 2, 120000, 180000, 1),
(3, 1, 3, 85000, 135000, 0),
(4, 1, 4, 110000, 165000, 0),
(5, 1, 5, 99000, 145000, 0),
(6, 1, 6, 107000, 160000, 0),
(7, 1, 7, 97000, 150000, 0),
(8, 1, 8, 114000, 168000, 0),
(9, 1, 9, 102000, 155000, 0),
(10, 1, 10, 98000, 146000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `khuyenmai`
--

CREATE TABLE `khuyenmai` (
  `MaKhuyenMai` int(11) NOT NULL,
  `TenKhuyenMai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `MoTaKhuyenMai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `PhanTram` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khuyenmai`
--

INSERT INTO `khuyenmai` (`MaKhuyenMai`, `TenKhuyenMai`, `MoTaKhuyenMai`, `PhanTram`) VALUES
(1, 'Giảm giá Tết Nguyên Đán', 'Giảm 30%', 30.00),
(2, 'Khuyến mãi 30/4 - 1/5', 'Giảm 20%', 20.00),
(3, 'Ưu đãi Quốc Khánh 2/9', 'Giảm 25%', 25.00),
(4, 'Giảm giá Giáng Sinh', 'Giảm 35%', 35.00),
(5, 'Khuyến mãi Black Friday', 'Giảm 50%', 50.00);

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
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
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`MaNguoiDung`, `HoTen`, `GioiTinh`, `Email`, `SoDienThoai`, `IDTaiKhoan`, `Anh`) VALUES
(1, 'Người dùng 1', 'Nam', 'nd1@gmail.com', '09000000', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nhacungcap`
--

CREATE TABLE `nhacungcap` (
  `MaNhaCungCap` int(11) NOT NULL,
  `TenNhaCungCap` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhacungcap`
--

INSERT INTO `nhacungcap` (`MaNhaCungCap`, `TenNhaCungCap`) VALUES
(1, 'Công Ty TNHH Thể Thao VN'),
(2, 'SportGear Co. Ltd'),
(3, 'Fitness Pro Supply'),
(4, 'Công Ty CP Dụng Cụ Gym'),
(5, 'Premium Sport Equipment');

-- --------------------------------------------------------

--
-- Table structure for table `nhanvien`
--

CREATE TABLE `nhanvien` (
  `MaNguoiDung` int(11) NOT NULL,
  `NgaySinh` date DEFAULT NULL,
  `Luong` decimal(18,2) DEFAULT NULL,
  `CCCD` char(12) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phanquyen`
--

CREATE TABLE `phanquyen` (
  `IDChucNang` int(11) NOT NULL,
  `IDQuyen` int(11) NOT NULL,
  `Them` tinyint(4) DEFAULT NULL,
  `Xoa` tinyint(4) DEFAULT NULL,
  `Sua` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phanquyen`
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
-- Table structure for table `phieunhap`
--

CREATE TABLE `phieunhap` (
  `MaPhieuNhap` int(11) NOT NULL,
  `TrangThai` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `IDTaiKhoan` int(11) DEFAULT NULL,
  `MaNhaCungCap` int(11) DEFAULT NULL,
  `NgayNhap` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phieunhap`
--

INSERT INTO `phieunhap` (`MaPhieuNhap`, `TrangThai`, `IDTaiKhoan`, `MaNhaCungCap`, `NgayNhap`) VALUES
(1, 'Đã Nhập', 1, 1, '2024-03-10');

-- --------------------------------------------------------

--
-- Table structure for table `quyen`
--

CREATE TABLE `quyen` (
  `IDQuyen` int(11) NOT NULL,
  `TenQuyen` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quyen`
--

INSERT INTO `quyen` (`IDQuyen`, `TenQuyen`) VALUES
(1, 'Admin'),
(2, 'Khách hàng'),
(3, 'Nhân viên');

-- --------------------------------------------------------

--
-- Table structure for table `taikhoan`
--

CREATE TABLE `taikhoan` (
  `IDTaiKhoan` int(11) NOT NULL,
  `TaiKhoan` char(20) DEFAULT NULL,
  `matKhau` varbinary(64) DEFAULT NULL,
  `IDQuyen` int(11) DEFAULT NULL,
  `TrangThai` tinyint(1) NOT NULL DEFAULT 0,
  `SessionID` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taikhoan`
--

INSERT INTO `taikhoan` (`IDTaiKhoan`, `TaiKhoan`, `matKhau`, `IDQuyen`, `TrangThai`, `SessionID`) VALUES
(1, 'admin', 0x5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5, 1, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `theloai`
--

CREATE TABLE `theloai` (
  `MaTheLoai` int(11) NOT NULL,
  `TenTheLoai` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `theloai`
--

INSERT INTO `theloai` (`MaTheLoai`, `TenTheLoai`) VALUES
(1, 'Các thiết bị tạ'),
(2, 'Thiết bị cardio'),
(3, 'Thời trang thể thao'),
(4, 'Thực phẩm bổ sung'),
(5, 'Dụng cụ khác');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chitiethanghoa`
--
ALTER TABLE `chitiethanghoa`
  ADD PRIMARY KEY (`MaHangHoa`);

--
-- Indexes for table `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD KEY `FK_ChiTietHoaDon_KhoHang` (`Seri`),
  ADD KEY `FK_ChiTietHoaDon_HoaDon1` (`MaHoaDon`);

--
-- Indexes for table `chucnang`
--
ALTER TABLE `chucnang`
  ADD PRIMARY KEY (`IDChucNang`);

--
-- Indexes for table `chungloai`
--
ALTER TABLE `chungloai`
  ADD PRIMARY KEY (`MaChungLoai`),
  ADD KEY `FK_ChungLoai_TheLoai` (`MaTheLoai`);

--
-- Indexes for table `hang`
--
ALTER TABLE `hang`
  ADD PRIMARY KEY (`MaHang`);

--
-- Indexes for table `hanghoa`
--
ALTER TABLE `hanghoa`
  ADD PRIMARY KEY (`MaHangHoa`),
  ADD KEY `FK_HangHoa_ChungLoai` (`MaChungLoai`),
  ADD KEY `FK_HangHoa_Hang` (`MaHang`),
  ADD KEY `FK_HangHoa_KhuyenMai1` (`MaKhuyenMai`);

--
-- Indexes for table `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`MaHoaDon`),
  ADD KEY `FK_HoaDon_TaiKhoan1` (`IDTaiKhoan`);

--
-- Indexes for table `khohang`
--
ALTER TABLE `khohang`
  ADD PRIMARY KEY (`Seri`),
  ADD KEY `FK_ChiTietPhieuNhap_HangHoa` (`MaHangHoa`),
  ADD KEY `FK_ChiTietPhieuNhap_PhieuNhap` (`MaPhieuNhap`);

--
-- Indexes for table `khuyenmai`
--
ALTER TABLE `khuyenmai`
  ADD PRIMARY KEY (`MaKhuyenMai`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`MaNguoiDung`),
  ADD KEY `FK_HoiVien_TaiKhoan1` (`IDTaiKhoan`);

--
-- Indexes for table `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD PRIMARY KEY (`MaNhaCungCap`),
  ADD UNIQUE KEY `MaNhaCungCap` (`MaNhaCungCap`);

--
-- Indexes for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`MaNguoiDung`);

--
-- Indexes for table `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD PRIMARY KEY (`IDChucNang`,`IDQuyen`),
  ADD KEY `FK_PhanQuyen_Quyen1` (`IDQuyen`);

--
-- Indexes for table `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD PRIMARY KEY (`MaPhieuNhap`),
  ADD KEY `FK_PhieuNhap_NhaCungCap` (`MaNhaCungCap`),
  ADD KEY `FK_PhieuNhap_TaiKhoan` (`IDTaiKhoan`);

--
-- Indexes for table `quyen`
--
ALTER TABLE `quyen`
  ADD PRIMARY KEY (`IDQuyen`),
  ADD UNIQUE KEY `TenQuyen` (`TenQuyen`);

--
-- Indexes for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`IDTaiKhoan`),
  ADD KEY `FK_TaiKhoan_Quyen` (`IDQuyen`);

--
-- Indexes for table `theloai`
--
ALTER TABLE `theloai`
  ADD PRIMARY KEY (`MaTheLoai`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chucnang`
--
ALTER TABLE `chucnang`
  MODIFY `IDChucNang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `chungloai`
--
ALTER TABLE `chungloai`
  MODIFY `MaChungLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `hang`
--
ALTER TABLE `hang`
  MODIFY `MaHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `hanghoa`
--
ALTER TABLE `hanghoa`
  MODIFY `MaHangHoa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `hoadon`
--
ALTER TABLE `hoadon`
  MODIFY `MaHoaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `khohang`
--
ALTER TABLE `khohang`
  MODIFY `Seri` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `khuyenmai`
--
ALTER TABLE `khuyenmai`
  MODIFY `MaKhuyenMai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `MaNguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `nhacungcap`
--
ALTER TABLE `nhacungcap`
  MODIFY `MaNhaCungCap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `phieunhap`
--
ALTER TABLE `phieunhap`
  MODIFY `MaPhieuNhap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `quyen`
--
ALTER TABLE `quyen`
  MODIFY `IDQuyen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `IDTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `theloai`
--
ALTER TABLE `theloai`
  MODIFY `MaTheLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chitiethanghoa`
--
ALTER TABLE `chitiethanghoa`
  ADD CONSTRAINT `FK_ChiTietHangHoa_HangHoa` FOREIGN KEY (`MaHangHoa`) REFERENCES `hanghoa` (`MaHangHoa`);

--
-- Constraints for table `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD CONSTRAINT `FK_ChiTietHoaDon_HoaDon1` FOREIGN KEY (`MaHoaDon`) REFERENCES `hoadon` (`MaHoaDon`),
  ADD CONSTRAINT `FK_ChiTietHoaDon_KhoHang` FOREIGN KEY (`Seri`) REFERENCES `khohang` (`Seri`);

--
-- Constraints for table `chungloai`
--
ALTER TABLE `chungloai`
  ADD CONSTRAINT `FK_ChungLoai_TheLoai` FOREIGN KEY (`MaTheLoai`) REFERENCES `theloai` (`MaTheLoai`);

--
-- Constraints for table `hanghoa`
--
ALTER TABLE `hanghoa`
  ADD CONSTRAINT `FK_HangHoa_ChungLoai` FOREIGN KEY (`MaChungLoai`) REFERENCES `chungloai` (`MaChungLoai`),
  ADD CONSTRAINT `FK_HangHoa_Hang` FOREIGN KEY (`MaHang`) REFERENCES `hang` (`MaHang`),
  ADD CONSTRAINT `FK_HangHoa_KhuyenMai1` FOREIGN KEY (`MaKhuyenMai`) REFERENCES `khuyenmai` (`MaKhuyenMai`);

--
-- Constraints for table `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `FK_HoaDon_TaiKhoan1` FOREIGN KEY (`IDTaiKhoan`) REFERENCES `taikhoan` (`IDTaiKhoan`);

--
-- Constraints for table `khohang`
--
ALTER TABLE `khohang`
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_HangHoa` FOREIGN KEY (`MaHangHoa`) REFERENCES `hanghoa` (`MaHangHoa`),
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_PhieuNhap` FOREIGN KEY (`MaPhieuNhap`) REFERENCES `phieunhap` (`MaPhieuNhap`);

--
-- Constraints for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD CONSTRAINT `FK_HoiVien_TaiKhoan1` FOREIGN KEY (`IDTaiKhoan`) REFERENCES `taikhoan` (`IDTaiKhoan`);

--
-- Constraints for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD CONSTRAINT `FK_NhanVien_NguoiDung` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`);

--
-- Constraints for table `phanquyen`
--
ALTER TABLE `phanquyen`
  ADD CONSTRAINT `FK_PhanQuyen_Quyen` FOREIGN KEY (`IDChucNang`) REFERENCES `chucnang` (`IDChucNang`),
  ADD CONSTRAINT `FK_PhanQuyen_Quyen1` FOREIGN KEY (`IDQuyen`) REFERENCES `quyen` (`IDQuyen`);

--
-- Constraints for table `phieunhap`
--
ALTER TABLE `phieunhap`
  ADD CONSTRAINT `FK_PhieuNhap_NhaCungCap` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `nhacungcap` (`MaNhaCungCap`),
  ADD CONSTRAINT `FK_PhieuNhap_TaiKhoan` FOREIGN KEY (`IDTaiKhoan`) REFERENCES `taikhoan` (`IDTaiKhoan`);

--
-- Constraints for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `FK_TaiKhoan_Quyen` FOREIGN KEY (`IDQuyen`) REFERENCES `quyen` (`IDQuyen`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
