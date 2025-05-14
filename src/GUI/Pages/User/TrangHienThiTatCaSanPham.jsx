import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, FormCheck, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Funnel } from 'react-bootstrap-icons';

import SanPhamCardLayout from '../../Components/SanPhamCardLayout';
import { getAllHangHoa } from '../../../DAL/apiTrangChuUser'; // Import the new API function

const TrangHienThiTatCaSanPham = () => {
    const { tenSanPham: encodedSearchTerm } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); 

    const [listSanPham, setListSanPham] = useState([]); // Sản phẩm tìm kiếm
    const [allProducts, setAllProducts] = useState([]); // Tất cả sản phẩm
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('default');

    
    // Lọc theo khoảng giá
    const [overallMinPrice, setOverallMinPrice] = useState(0);
    const [overallMaxPrice, setOverallMaxPrice] = useState(10000000);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [tempMaxPrice, setTempMaxPrice] = useState(10000000);

    // Lọc theo khuyến mãi
    const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

    // Lọc theo chủng loại
    const [availableChungLoai, setAvailableChungLoai] = useState([]); // { MaChungLoai, TenChungLoai }
    const [selectedChungLoai, setSelectedChungLoai] = useState([]); // Chọn theo chủng loại
    const [showAllChungLoai, setShowAllChungLoai] = useState(true); // Chọn tất cả

    useEffect(() => {
        if (encodedSearchTerm) {
            setSearchTerm(decodeURIComponent(encodedSearchTerm));
        }
    }, [encodedSearchTerm]);

    // Fetch all products
    useEffect(() => {
        setLoading(true);
        // Lấy nội dung tìm kiếm từ URL
        const currentSearchTerm = encodedSearchTerm ? decodeURIComponent(encodedSearchTerm) : '';
        // console.log("Current Search Term:", currentSearchTerm); 
        getAllHangHoa(currentSearchTerm) // yêu cầu API
            .then(apiResponse => { 
                const products = (apiResponse && apiResponse.success && Array.isArray(apiResponse.data)) ? apiResponse.data : [];
                if (currentSearchTerm === '') {
                    setAllProducts(products); 
                    // console.log("All products fetched:", products); 
                }
                setListSanPham(products);
                if (products.length > 0) {
                    const prices = products.map(p => parseFloat(p.GiaBan)).filter(p => !isNaN(p));
                    const min = prices.length > 0 ? Math.min(...prices) : 0;
                    const max = prices.length > 0 ? Math.max(...prices) : 10000000;
                    setOverallMinPrice(min);
                    setOverallMaxPrice(max);
                    setMinPrice(min);
                    setMaxPrice(max);
                    setTempMaxPrice(max);

                    // Lấy sản phẩm theo chủng loại
                    const uniqueCL = [];
                    const map = new Map();
                    for (const item of products) {
                        if (item.MaChungLoai && item.TenChungLoai && !map.has(item.MaChungLoai)) {
                            map.set(item.MaChungLoai, true);
                            uniqueCL.push({ MaChungLoai: item.MaChungLoai.toString(), TenChungLoai: item.TenChungLoai });
                        }
                    }
                    setAvailableChungLoai(uniqueCL);

                } else {
                    setOverallMinPrice(0);
                    setOverallMaxPrice(10000000);
                    setMinPrice(0);
                    setMaxPrice(10000000);
                    setTempMaxPrice(10000000);
                    setAvailableChungLoai([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching all products:", error);
                setListSanPham([]);
                setOverallMinPrice(0);
                setOverallMaxPrice(10000000);
                setMinPrice(0);
                setMaxPrice(10000000);
                setTempMaxPrice(10000000);
                setAvailableChungLoai([]);
                setLoading(false);
            });
    }, [encodedSearchTerm]); // fetch khi searchTerm thay đổi

    // Effect for filtering and sorting
    useEffect(() => {
        let filtered = [...listSanPham];

        // Thêm điều kiện lọc theo tên sản phẩm
        if (searchTerm) {
            filtered = filtered.filter(sp =>
                sp.TenHangHoa && sp.TenHangHoa.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Lọc theo chủng loại
        if (!showAllChungLoai && selectedChungLoai.length > 0) {
            filtered = filtered.filter(sp =>
                sp.MaChungLoai && selectedChungLoai.includes(sp.MaChungLoai.toString())
            );
        }

        // Lọc theo khuyến mãi
        if (showDiscountedOnly) {
            filtered = filtered.filter(sp => sp.PhanTram != null && parseFloat(sp.PhanTram) > 0);
        }

        // Lọc theo khoảng giá
        if (minPrice > overallMinPrice || maxPrice < overallMaxPrice || minPrice !== 0 || maxPrice !== 0) {
             filtered = filtered.filter(sp => {
                const giaBan = parseFloat(sp.GiaBan);
                return !isNaN(giaBan) && giaBan >= minPrice && giaBan <= maxPrice;
            });
        }


        // Nhóm sản phẩm theo MaHangHoa, reduce() là một phương thức của mảng (Array) dùng để rút gọn (reduce) toàn bộ mảng thành một giá trị duy nhất
        const groupedByMaHangHoa = filtered.reduce((acc, sp) => {
            const key = sp.MaHangHoa;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(sp);
            return acc;
        }, {});

        // 5. Chọn sản phẩm đại diện cho mỗi nhóm chọn giá bán thấp nhất của loại hàng hoá
        let representativeProducts = Object.values(groupedByMaHangHoa).map(group => {
            group.sort((a, b) => parseFloat(a.GiaBan) - parseFloat(b.GiaBan));
            return group[0];
        });

        // 6. Sắp xếp sản phẩm đại diện theo giá bán
        switch (sortOrder) {
            case 'price-asc':
                representativeProducts.sort((a, b) => parseFloat(a.GiaBan) - parseFloat(b.GiaBan));
                break;
            case 'price-desc':
                representativeProducts.sort((a, b) => parseFloat(b.GiaBan) - parseFloat(a.GiaBan));
                break;
            case 'default':
            default:
                 // Default sort could be by MaHangHoa or relevance if available
                representativeProducts.sort((a, b) => (a.MaHangHoa && b.MaHangHoa) ? a.MaHangHoa.toString().localeCompare(b.MaHangHoa.toString()) : 0);
                break;
        }

        setDisplayedProducts(representativeProducts);

    }, [listSanPham, searchTerm, sortOrder, minPrice, maxPrice, showDiscountedOnly, selectedChungLoai, overallMinPrice, overallMaxPrice, showAllChungLoai]);


    const handleSortChange = (event) => setSortOrder(event.target.value);
    const handleDiscountFilterChange = (event) => setShowDiscountedOnly(event.target.checked);

    const handlePriceChange = (event) => {
        const newMax = parseInt(event.target.value, 10);
        setTempMaxPrice(newMax);
        setMaxPrice(newMax);
        if (minPrice > newMax) setMinPrice(newMax);
    };

    const handleMinPriceInputChange = (event) => {
        let newMin = parseInt(event.target.value, 10) || overallMinPrice;
        newMin = Math.max(overallMinPrice, Math.min(newMin, maxPrice));
        setMinPrice(newMin);
    };

    const handleMaxPriceInputChange = (event) => {
        let newMax = parseInt(event.target.value, 10) || overallMaxPrice;
        newMax = Math.min(overallMaxPrice, Math.max(newMax, minPrice));
        setMaxPrice(newMax);
        setTempMaxPrice(newMax);
    };
    
    const handleChungLoaiChange = (event) => {
        const { value, checked, id } = event.target;

        if (id === "chungloai-filter-all") {
            setShowAllChungLoai(checked);
            if (checked) {
                setSelectedChungLoai([]); // Clear specific selections if "All" is checked

            }
        } else {
            setSelectedChungLoai(prev => {
                const newSelection = checked ? [...prev, value] : prev.filter(cl => cl !== value);
                // If any specific CL is checked, uncheck "All"
                if (newSelection.length > 0) {
                    setShowAllChungLoai(false);
                } else {
                    // If all specific CLs are unchecked, check "All"
                    setShowAllChungLoai(true);
                }
                return newSelection;
            });
        }
    };
    
    const handleViewAllProducts = () => {
        setSearchTerm('');
        setShowDiscountedOnly(false);
        setSelectedChungLoai([]);
        setShowAllChungLoai(true);
        setSortOrder('default');
        const currentProductsForRange = allProducts; 
        // console.log("Current products for range:", currentProductsForRange);
        if (currentProductsForRange.length > 0) {
            const prices = currentProductsForRange.map(p => parseFloat(p.GiaBan)).filter(p => !isNaN(p));
            const min = prices.length > 0 ? Math.min(...prices) : 0;
            const max = prices.length > 0 ? Math.max(...prices) : 10000000;
            setMinPrice(min);
            setMaxPrice(max);
            setTempMaxPrice(max);
        } else {
            setMinPrice(0);
            setMaxPrice(10000000);
            setTempMaxPrice(10000000);
        }

        // đổi URL thành '/tim-kiem' mà không làm mới trang
        if (encodedSearchTerm) {
            navigate('/tim-kiem'); 
        }
    };


    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };


    return (
        <Container fluid className="my-4 min-vh-100">
            <Row>
                {/* Lọc */}
                <Col md={3} lg={2} className="border-end pe-3 mb-3 mb-md-0">
                    <h4 className='font-weight-bold mb-3'>
                        <Funnel className="me-2" />
                        Bộ lọc
                    </h4>
                    <hr/>
                    <Button 
                        variant="primary" // Changed from "outline-primary" for a filled look
                        size="sm" 
                        className="w-100 mb-3 fw-bold" // Added fw-bold for emphasis
                        onClick={handleViewAllProducts}
                    >
                        Xem tất cả sản phẩm
                    </Button>
                    {/* Lọc theo khuyến mãi */}
                    <div className="mb-3 mt-3 border-top pt-3">
                        <h6>Khuyến mãi</h6>
                        <Form.Check
                            type="checkbox"
                            id="discount-filter-search"
                            label="Chỉ sản phẩm khuyến mãi"
                            checked={showDiscountedOnly}
                            onChange={handleDiscountFilterChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Lọc theo giá */}
                    <div className="mb-3 mt-3 border-top pt-3">
                        <h6>Khoảng giá</h6>
                        <Form.Label htmlFor="priceRangeSearch">
                            {formatCurrency(minPrice)} - {formatCurrency(tempMaxPrice)}
                        </Form.Label>
                        <Form.Range
                            id="priceRangeSearch"
                            min={overallMinPrice}
                            max={overallMaxPrice}
                            value={tempMaxPrice}
                            onChange={handlePriceChange}
                            step={10000}
                            disabled={loading || listSanPham.length === 0}
                        />
                        <Row className="g-2 mt-2">
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text>Từ</InputGroup.Text>
                                    <Form.Control type="number" value={minPrice} onChange={handleMinPriceInputChange} min={overallMinPrice} max={maxPrice} step={10000} disabled={loading || listSanPham.length === 0} />
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text>Đến</InputGroup.Text>
                                    <Form.Control type="number" value={maxPrice} onChange={handleMaxPriceInputChange} min={minPrice} max={overallMaxPrice} step={10000} disabled={loading || listSanPham.length === 0} />
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>

                    {/* Lọc theo chủng loại */}
                    {availableChungLoai.length > 0 && (
                        <div className="mb-3 mt-3 border-top pt-3">
                            <h6>Chủng loại</h6>
                            <Form.Check
                                type="checkbox"
                                id="chungloai-filter-all"
                                label="Tất cả chủng loại"
                                checked={showAllChungLoai}
                                onChange={handleChungLoaiChange}
                                disabled={loading}
                            />
                            <hr className="my-2" /> 
                            {availableChungLoai.map(cl => (
                                <Form.Check
                                    type="checkbox"
                                    key={cl.MaChungLoai}
                                    id={`chungloai-filter-${cl.MaChungLoai}`}
                                    label={cl.TenChungLoai}
                                    value={cl.MaChungLoai}
                                    checked={!showAllChungLoai && selectedChungLoai.includes(cl.MaChungLoai)}
                                    onChange={handleChungLoaiChange}
                                    disabled={loading || showAllChungLoai} // Disable if "All" is checked
                                />
                            ))}
                        </div>
                    )}
                </Col>

                {/* Hiển thị sản phẩm */}
                <Col md={9} lg={10}>
                    <Row className="mb-3 align-items-center">
                        <Col>
                            <h4>
                                {searchTerm ? `Kết quả tìm kiếm cho: "${searchTerm}"` : "Tất cả sản phẩm"}
                            </h4>
                        </Col>
                        <Col xs="auto">
                            <Form.Select aria-label="Sắp xếp sản phẩm" value={sortOrder} onChange={handleSortChange} size="sm" disabled={loading}>
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
                            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                                {displayedProducts.map(sp => {
                                    let imagePath = sp.Anh;
                                    if (imagePath && !imagePath.startsWith('http')) {
                                        if (imagePath.startsWith('../')) {
                                            imagePath = '/' + imagePath.substring(3);
                                        } else if (!imagePath.startsWith('/')) {
                                            imagePath = '/' + imagePath;
                                        }
                                    }
                                    return (
                                        <Col key={`${sp.MaHangHoa}-${sp.IDBienThe}`}> {/* Ensure unique key if variants are present */}
                                            <SanPhamCardLayout
                                                MaHangHoa={sp.MaHangHoa}
                                                TenHangHoa={sp.TenHangHoa}
                                                GiaGoc={parseFloat(sp.GiaBan)}
                                                Anh={imagePath || '/assets/AnhHangHoa/0.png'} // Default image
                                                PhanTramKM={parseFloat(sp.PhanTram) || 0}
                                                MoTa={sp.MoTa}
                                                // Pass IDBienThe if your SanPhamCardLayout uses it for navigation
                                                IDBienThe={sp.IDBienThe} 
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                            {displayedProducts.length === 0 && !loading && (
                                <p>Không có sản phẩm nào phù hợp với tiêu chí của bạn.</p>
                            )}
                        </>
                    )}
                </Col>
            </Row>
            
        </Container>
    );
}

export default TrangHienThiTatCaSanPham;