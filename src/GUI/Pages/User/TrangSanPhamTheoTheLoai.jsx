import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; // Import useParams

import LocTheoCacThietBiTa from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoCacThietBiTa';
import LocTheoThietBiCardio from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoThietBiCardio';
import LocTheoThoiTrang from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoThoiTrang';
import LocTheoThucPham from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoThucPham';
import LocTheoCacThietBiKhac from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoCacThietBiKhac';
import { getHangHoaTheoTheLoai } from '../../../DAL/apiTrangChuUser.jsx';
import SanPhamCardLayout from '../../Components/SanPhamCardLayout';
import { Funnel } from 'react-bootstrap-icons'; // Import the icon

const MA_THE_LOAI = {
    TA: 1,
    CARDIO: 2,
    THOI_TRANG: 3,
    THUCPHAM: 4,
    KHAC: 5
};

function TrangSanPhamTheoTheLoai() {
    // Lấy cả maTheLoai và maChungLoaiUrl từ URL
    const { maTheLoai: maTheLoaiStr, maChungLoaiUrl } = useParams();
    const maTheLoai = parseInt(maTheLoaiStr, 10);

    const [sortOrder, setSortOrder] = useState('default');
    const [listSanPham, setListSanPham] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedChungLoai, setSelectedChungLoai] = useState([]);

    const [displayedProducts, setDisplayedProducts] = useState([]);

    const [selectedKhoiLuong, setSelectedKhoiLuong] = useState([]);

    const [selectedClothingSizes, setSelectedClothingSizes] = useState([]); 

    const [selectedShoeSizes, setSelectedShoeSizes] = useState([]);       
    
    // useEffect để khởi tạo bộ lọc từ URL
    useEffect(() => {
        if (maChungLoaiUrl) {
            setSelectedChungLoai([maChungLoaiUrl.toString()]);
            console.log("Initialized selectedChungLoai from URL:", [maChungLoaiUrl.toString()]);
        } else {
            setSelectedChungLoai([]);
        }
        // Reset các bộ lọc khác khi URL thay đổi
        setSelectedKhoiLuong([]);
        setSelectedClothingSizes([]);
        setSelectedShoeSizes([]);
    }, [maChungLoaiUrl]); // Chạy lại khi maChungLoaiUrl thay đổi

    // useEffect để fetch sản phẩm gốc (có thể gộp với useEffect trên nếu muốn)
    useEffect(() => {
        setLoading(true);
        if (!maChungLoaiUrl) {
             setSelectedChungLoai([]);
        }

        setSelectedKhoiLuong([]);
        setSelectedClothingSizes([]);
        setSelectedShoeSizes([]);

        getHangHoaTheoTheLoai(maTheLoai)
          .then(data => {
            setListSanPham(data || []);
            setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching products:", error);
            setListSanPham([]);
            setLoading(false);
          });
    }, [maTheLoai, maChungLoaiUrl]); // Chạy lại khi maTheLoai hoặc maChungLoaiUrl thay đổi

    useEffect(() => {
        let filtered = [...listSanPham]; 

        if (selectedChungLoai.length > 0) {
            // Chuyển đổi selectedChungLoai sang cùng kiểu với sp.MaChungLoai để so sánh chính xác
            const selectedIds = selectedChungLoai.map(id => id.toString()); // Giả sử MaChungLoai trong sản phẩm là number hoặc string
            filtered = filtered.filter(sp =>
                sp.MaChungLoai && selectedIds.includes(sp.MaChungLoai.toString())
            );
        }

        
        // 2. Lọc theo Khối lượng (chỉ áp dụng nếu là thể loại Tạ và có lựa chọn)
        if (maTheLoai === MA_THE_LOAI.TA && selectedKhoiLuong.length > 0) {
            // Giả sử sp.KhoiLuong là number (kg) và selectedKhoiLuong chứa các giá trị số
            const selectedWeights = selectedKhoiLuong.map(w => parseFloat(w)); // Chuyển sang số
            filtered = filtered.filter(sp =>
                sp.IDKhoiLuongTa !== undefined && selectedWeights.includes(sp.IDKhoiLuongTa)
            );
        }

        // 3. Lọc theo Size Quần Áo (chỉ cho Thời Trang)
        if (maTheLoai === MA_THE_LOAI.THOI_TRANG && selectedClothingSizes.length > 0) {
            filtered = filtered.filter(sp =>
                sp.IDKichThuocQuanAo != null && selectedClothingSizes.includes(sp.IDKichThuocQuanAo.toString())
            );
        }

        // 4. Lọc theo Size Giày (chỉ cho Thời Trang)
        if (maTheLoai === MA_THE_LOAI.THOI_TRANG && selectedShoeSizes.length > 0) {
            filtered = filtered.filter(sp =>
                sp.IDKichThuocGiay != null && selectedShoeSizes.includes(sp.IDKichThuocGiay.toString()) // Dòng 111 (đã sửa)
            );
        }


        switch (sortOrder) {
            case 'price-asc':
                filtered.sort((a, b) => a.GiaBan - b.GiaBan);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.GiaBan - a.GiaBan);
                break;
            case 'default':
            default:
                break;
        }
        setDisplayedProducts(filtered); 

    }, [listSanPham, selectedChungLoai, sortOrder, selectedKhoiLuong, maTheLoai, selectedClothingSizes,selectedShoeSizes]); // Chạy lại khi các dependencies này thay đổi

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // Hàm render component lọc dựa trên maTheLoai
    const renderFilterComponent = () => {
        // Truyền state bộ lọc và hàm cập nhật xuống
        const filterProps = {
            selectedChungLoai: selectedChungLoai, 
            setSelectedChungLoai: setSelectedChungLoai,
            selectedKhoiLuong: selectedKhoiLuong, 
            setSelectedKhoiLuong: setSelectedKhoiLuong,
            selectedClothingSizes:selectedClothingSizes,
            setSelectedClothingSizes:setSelectedClothingSizes,
            selectedShoeSizes:selectedShoeSizes,
            setSelectedShoeSizes:setSelectedShoeSizes
        };

        switch (maTheLoai) {
            // ... các case cho từng thể loại ...
             case MA_THE_LOAI.TA:
                return <LocTheoCacThietBiTa {...filterProps} />;
            case MA_THE_LOAI.CARDIO:
                return <LocTheoThietBiCardio {...filterProps} />;
            case MA_THE_LOAI.THOI_TRANG:
                return <LocTheoThoiTrang {...filterProps} />;
            case MA_THE_LOAI.THUCPHAM:
                return <LocTheoThucPham {...filterProps} />;
            case MA_THE_LOAI.KHAC:
                return <LocTheoCacThietBiKhac {...filterProps} />;
            default:
                return <p>Thể loại không hợp lệ.</p>;
        }
    };

    let title = "Danh sách sản phẩm";
    const renderTitle = () => {
        switch (maTheLoai) {
            case MA_THE_LOAI.TA:
                title = title + " Thiết bị tạ";
                break;
            case MA_THE_LOAI.CARDIO:
                title = title + " Thiết bị Cardio";
                break;
            case MA_THE_LOAI.THOI_TRANG:
                title = title + " Thời trang & Phụ kiện";
                break;
            case MA_THE_LOAI.THUCPHAM:
                title = title + " Thực phẩm bổ sung";
                break;
            case MA_THE_LOAI.KHAC:
                title = title + " Khác";
                break;
            default:
                title = title + " Danh sách sản phẩm";
        };
        return title;
    }
    return (
        <Container fluid className="my-4 min-vh-100">
            <Row>
                {/* Phần Bộ lọc (Bên trái) */}
                <Col md={3} lg={2} className="border-end pe-3 mb-3 mb-md-0">
                    <h4 className='font-weight-bold mb-3'>
                        <Funnel className="me-2" />
                        Bộ lọc
                    </h4>
                    {renderFilterComponent()}
                </Col>

                <Col md={9} lg={10}>
                     <Row className="mb-3 align-items-center">
                        <Col>
                            <h4>{renderTitle()}</h4>
                        </Col>
                        <Col xs="auto">
                            <Form.Select
                                aria-label="Sắp xếp sản phẩm"
                                value={sortOrder}
                                onChange={handleSortChange}
                                size="sm"
                            >
                                <option value="default">Mặc định</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {loading ? (
                        <p>Đang tải sản phẩm...</p>
                    ) : (
                        <>
                            <Row>
                                {displayedProducts.map(sp => {
                                    let imagePath = sp.Anh; // Bắt đầu với đường dẫn gốc từ API

                                    // Chỉ xử lý nếu đường dẫn tồn tại và không phải URL đầy đủ
                                    if (imagePath && !imagePath.startsWith('http')) {
                                        // Nếu bắt đầu bằng '../', loại bỏ nó và thêm '/' vào đầu
                                        if (imagePath.startsWith('../')) {
                                            imagePath = '/' + imagePath.substring(3);
                                        }
                                        // Nếu không bắt đầu bằng '/', thêm '/' vào đầu (để thành đường dẫn tuyệt đối từ gốc)
                                        else if (!imagePath.startsWith('/')) {
                                            imagePath = '/' + imagePath;
                                        }
                                        // Nếu đã bắt đầu bằng '/', giữ nguyên
                                    }

                                    return (
                                        <Col key={sp.MaHangHoa} sm={6} md={4} lg={3} className="mb-4">
                                            <SanPhamCardLayout
                                                MaHangHoa={sp.MaHangHoa}
                                                TenHangHoa={sp.TenHangHoa}
                                                GiaGoc={sp.GiaBan}
                                                // Truyền đường dẫn đã xử lý
                                                Anh={imagePath}
                                                PhanTramKM={sp.PhanTram}
                                                MoTa={sp.MoTa}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                            {/* Hiển thị thông báo nếu không có sản phẩm nào sau khi lọc */}
                            {displayedProducts.length === 0 && !loading && <p>Không có sản phẩm nào phù hợp với tiêu chí lọc.</p>}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default TrangSanPhamTheoTheLoai;