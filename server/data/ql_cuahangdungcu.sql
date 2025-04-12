-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 12, 2025 lúc 06:34 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

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
-- Cấu trúc bảng cho bảng `khohang`
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
-- Đang đổ dữ liệu cho bảng `khohang`
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

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `khohang`
--
ALTER TABLE `khohang`
  ADD PRIMARY KEY (`Seri`),
  ADD KEY `FK_ChiTietPhieuNhap_HangHoa` (`MaHangHoa`),
  ADD KEY `FK_ChiTietPhieuNhap_PhieuNhap` (`MaPhieuNhap`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `khohang`
--
ALTER TABLE `khohang`
  MODIFY `Seri` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `khohang`
--
ALTER TABLE `khohang`
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_HangHoa` FOREIGN KEY (`MaHangHoa`) REFERENCES `hanghoa` (`MaHangHoa`),
  ADD CONSTRAINT `FK_ChiTietPhieuNhap_PhieuNhap` FOREIGN KEY (`MaPhieuNhap`) REFERENCES `phieunhap` (`MaPhieuNhap`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
