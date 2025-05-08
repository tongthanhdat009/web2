import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom'; // Import useParams

import LocTheoCacThietBiTa from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoCacThietBiTa';
import LocTheoThietBiCardio from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoThietBiCardio';
import LocTheoThoiTrang from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoThoiTrang';
import LocTheoThucPham from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoThucPham';
import LocTheoCacThietBiKhac from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoCacThietBiKhac';
import LocTheoSizeGiay from '../../Components/TrangHienThiSanPhamTheoTheLoai/Filters/LocTheoSizeGiay';
import { getHangHoaTheoTheLoai } from '../../../DAL/apiTrangChuUser.jsx';
import SanPhamCardLayout from '../../Components/SanPhamCardLayout';
import { Funnel } from 'react-bootstrap-icons'; // Import the icon

const MA_THE_LOAI = {
    TA: 1,
    CARDIO: 2,
    THOI_TRANG: 3,
    THUCPHAM: 4,
    KHAC: 5,
    GIAY: 6,
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
    
    const [selectedShoeTypes, setSelectedShoeTypes] = useState([]);       


    // --- State mới cho bộ lọc giá ---
    const [overallMinPrice, setOverallMinPrice] = useState(0);
    const [overallMaxPrice, setOverallMaxPrice] = useState(10000000); // Giá trị mặc định lớn
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);

    // --- State mới cho bộ lọc khuyến mãi ---
    const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

    // State để debounce việc cập nhật giá khi kéo slider
    const [tempMaxPrice, setTempMaxPrice] = useState(10000000);

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
        setShowDiscountedOnly(false); 
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
        setShowDiscountedOnly(false);

        getHangHoaTheoTheLoai(maTheLoai)
          .then(data => {
            const products = data || [];
            setListSanPham(products);

            // --- Tính toán và đặt giới hạn giá ---
            if (products.length > 0) {
                const prices = products.map(p => p.GiaBan);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                setOverallMinPrice(min);
                setOverallMaxPrice(max);
                // Reset bộ lọc giá về giới hạn tổng thể
                setMinPrice(min);
                setMaxPrice(max);
                setTempMaxPrice(max); // Reset cả temp
            } else {
                // Đặt giá trị mặc định nếu không có sản phẩm
                setOverallMinPrice(0);
                setOverallMaxPrice(10000000);
                setMinPrice(0);
                setMaxPrice(10000000);
                setTempMaxPrice(10000000);
            }

            setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching products:", error);
            setListSanPham([]);
             // Đặt giá trị mặc định khi lỗi
            setOverallMinPrice(0);
            setOverallMaxPrice(10000000);
            setMinPrice(0);
            setMaxPrice(10000000);
            setTempMaxPrice(10000000);
            setShowDiscountedOnly(false); 
            setLoading(false);
          });
    }, [maTheLoai, maChungLoaiUrl]); // Chạy lại khi maTheLoai hoặc maChungLoaiUrl thay đổi

    useEffect(() => {
        let filtered = [...listSanPham]; 

        if (selectedChungLoai.length > 0) {
            const selectedIds = selectedChungLoai.map(id => id.toString()); //MaChungLoai trong sản phẩm là number hoặc string
            filtered = filtered.filter(sp =>
                sp.MaChungLoai && selectedIds.includes(sp.MaChungLoai.toString())
            );
        }

        // --- 0. Lọc theo Khuyến mãi (nếu được chọn) ---
        if (showDiscountedOnly) {
            filtered = filtered.filter(sp => sp.PhanTram != null && sp.PhanTram > 0);
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

        // 4. Lọc theo Size Giày (chỉ cho Giày)
        if (maTheLoai === MA_THE_LOAI.GIAY && selectedShoeSizes.length > 0) {
            filtered = filtered.filter(sp =>
                sp.IDKichThuocGiay != null && selectedShoeSizes.includes(sp.IDKichThuocGiay.toString()) 
            );
        }

        // 4. Lọc theo Size Giày (chỉ cho Giày)
        if (maTheLoai === MA_THE_LOAI.GIAY && selectedShoeTypes.length > 0) {
            filtered = filtered.filter(sp =>
                sp.MaChungLoai != null && selectedShoeTypes.includes(sp.MaChungLoai.toString()) 
            );
        }

        // --- 6. Lọc theo Giá ---
        // Chỉ lọc nếu minPrice hoặc maxPrice khác với giới hạn tổng thể
        if (minPrice > overallMinPrice || maxPrice < overallMaxPrice) {
            filtered = filtered.filter(sp =>
               sp.GiaBan >= minPrice && sp.GiaBan <= maxPrice
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

        const groupedByMaHangHoa = filtered.reduce((acc, sp) => {
            const key = sp.MaHangHoa;
            if (!acc[key]) {
                acc[key] = []; // Khởi tạo mảng cho MaHangHoa này nếu chưa có
            }
            acc[key].push(sp); // Thêm biến thể hiện tại vào nhóm
            return acc;
        }, {}); 

        let representativeProducts = Object.values(groupedByMaHangHoa).map(group => {
            // Sắp xếp các biến thể trong nhóm theo giá tăng dần
            group.sort((a, b) => a.GiaBan - b.GiaBan);
            // Trả về biến thể đầu tiên (giá thấp nhất) làm đại diện
            return group[0];
        });

        switch (sortOrder) {
            case 'price-asc':
                // Sắp xếp các đại diện theo giá của chúng (đã là giá thấp nhất)
                representativeProducts.sort((a, b) => a.GiaBan - b.GiaBan);
                break;
            case 'price-desc':
                // Sắp xếp các đại diện theo giá của chúng giảm dần
                representativeProducts.sort((a, b) => b.GiaBan - a.GiaBan);
                break;
            default:
                representativeProducts.sort((a, b) => a.MaHangHoa - b.MaHangHoa);
                break;
        }

        console.log("Filtered products:", representativeProducts); // Debug log
        setDisplayedProducts(representativeProducts);

    }, [listSanPham,
        selectedChungLoai, 
        sortOrder, 
        selectedKhoiLuong, 
        maTheLoai, 
        selectedClothingSizes,
        selectedShoeSizes,
        selectedShoeTypes, 
        minPrice, 
        maxPrice, 
        overallMinPrice, 
        overallMaxPrice,
        showDiscountedOnly]); // Chạy lại khi các dependencies này thay đổi

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // --- Hàm xử lý thay đổi giá từ thanh trượt ---
    const handlePriceChange = (event) => {
        const newMax = parseInt(event.target.value, 10);
        // Cập nhật giá trị tạm thời để hiển thị ngay lập tức
        setTempMaxPrice(newMax);
        // Chỉ cập nhật maxPrice thực tế (kích hoạt lọc) khi người dùng nhả chuột
        // (Sử dụng onMouseUp hoặc onChange tùy thuộc vào cách bạn muốn debounce)
        // Ở đây dùng onChange, có thể cân nhắc debounce nếu hiệu năng bị ảnh hưởng
        setMaxPrice(newMax);
        // Đảm bảo min không vượt quá max mới
        if (minPrice > newMax) {
            setMinPrice(newMax);
        }
    };

    // Hàm xử lý thay đổi giá từ input (ví dụ)
    const handleMinPriceInputChange = (event) => {
        let newMin = parseInt(event.target.value, 10) || overallMinPrice;
        newMin = Math.max(overallMinPrice, Math.min(newMin, maxPrice)); // Giới hạn trong khoảng hợp lệ
        setMinPrice(newMin);
    };

    const handleMaxPriceInputChange = (event) => {
        let newMax = parseInt(event.target.value, 10) || overallMaxPrice;
        newMax = Math.min(overallMaxPrice, Math.max(newMax, minPrice)); // Giới hạn trong khoảng hợp lệ
        setMaxPrice(newMax);
        setTempMaxPrice(newMax); // Đồng bộ tempMaxPrice
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
            setSelectedShoeSizes:setSelectedShoeSizes,
            selectedShoeTypes:selectedShoeTypes,
            setSelectedShoeTypes:setSelectedShoeTypes
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
            case MA_THE_LOAI.GIAY:
                return <LocTheoSizeGiay {...filterProps} />;
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
            case MA_THE_LOAI.GIAY:
                title = title + " Giày thể thao";
                break;
            default:
                title = title + " Danh sách sản phẩm";
        };
        return title;
    }
    
    // --- Hàm xử lý thay đổi checkbox khuyến mãi ---
     const handleDiscountFilterChange = (event) => {
        setShowDiscountedOnly(event.target.checked);
    };

    // Định dạng tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    return (
        <Container fluid className="my-4 min-vh-100">
            <Row>
                {/* Phần Bộ lọc (Bên trái) */}
                <Col md={3} lg={2} className="border-end pe-3 mb-3 mb-md-0">
                    <h4 className='font-weight-bold mb-3'>
                        <Funnel className="me-2" />
                        Bộ lọc
                    </h4>

                    {/* --- Bộ lọc Khuyến mãi --- */}
                    <div className="mb-3 mt-3 border-top pt-3">
                        <Form.Check
                            type="checkbox"
                            id="discount-filter"
                            label="Khuyến mãi"
                            checked={showDiscountedOnly}
                            onChange={handleDiscountFilterChange}
                            disabled={loading} // Vô hiệu hóa khi đang tải
                        />
                    </div>
                    
                    {/* --- Bộ lọc giá --- */}
                    <div className="mb-3 mt-3 border-top pt-3">
                        <h6>Khoảng giá</h6>
                        <Form.Label htmlFor="priceRange">
                            {formatCurrency(minPrice)} - {formatCurrency(tempMaxPrice)}
                        </Form.Label>
                        <Form.Range
                            id="priceRange"
                            min={overallMinPrice}
                            max={overallMaxPrice}
                            value={tempMaxPrice} // Hiển thị giá trị tạm thời khi kéo
                            onChange={handlePriceChange} // Cập nhật giá khi thay đổi
                            step={10000} // Bước nhảy (tùy chỉnh)
                            disabled={loading || listSanPham.length === 0} // Vô hiệu hóa khi đang tải hoặc không có SP
                        />
                         {/* (Tùy chọn) Thêm input để nhập giá min/max */}
                         <Row className="g-2 mt-2">
                             <Col>
                                 <InputGroup size="sm">
                                     <InputGroup.Text>Từ</InputGroup.Text>
                                     <Form.Control
                                         type="number"
                                         value={minPrice}
                                         onChange={handleMinPriceInputChange}
                                         min={overallMinPrice}
                                         max={maxPrice}
                                         step={10000}
                                         disabled={loading || listSanPham.length === 0}
                                     />
                                 </InputGroup>
                             </Col>
                             <Col>
                                 <InputGroup size="sm">
                                     <InputGroup.Text>Đến</InputGroup.Text>
                                     <Form.Control
                                         type="number"
                                         value={maxPrice} // Dùng maxPrice thực tế
                                         onChange={handleMaxPriceInputChange}
                                         min={minPrice}
                                         max={overallMaxPrice}
                                         step={10000}
                                         disabled={loading || listSanPham.length === 0}
                                     />
                                 </InputGroup>
                             </Col>
                         </Row>
                    </div>

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
                                                Anh={imagePath||'../assets/AnhHangHoa/0.png'}
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