import React, { useState } from 'react';
import { Container, Form, Button, InputGroup, Alert, Table, Spinner, Row, Col } from 'react-bootstrap';

// Function to call the API
const fetchSanPhamBySeri = async (seri) => {
    const apiUrl = `http://localhost/web2/server/api/TraCuuSPUser/getSanPhamBangSeri.php?seri=${encodeURIComponent(seri)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            // Try to parse error message from API if available
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
            } catch (parseError) {
                // Fallback if response is not JSON or message is missing
                throw new Error(`Lỗi HTTP: ${response.status} - parseError: ${parseError.message}`);
            }
        }
        const data = await response.json();
        return data; // API returns { success: boolean, data?: object, message?: string }
    } catch (error) {
        console.error("API call failed:", error);
        // Re-throw a more specific error structure for the component to handle
        throw { success: false, message: error.message || "Không thể kết nối đến máy chủ." };
    }
};

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Ngày không hợp lệ';
        }
        return date.toLocaleDateString('vi-VN'); // Format as DD/MM/YYYY
    } catch (e) {
        return e.message || 'Ngày không hợp lệ';
    }
};


function TrangTraCuuSanPham() {
    const [seriInput, setSeriInput] = useState('');
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setSeriInput(event.target.value);
        // Clear previous results/errors when user types again
        if (error) setError('');
        if (productInfo) setProductInfo(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission which reloads the page
        setError(''); // Clear previous errors
        setProductInfo(null); // Clear previous results

        if (!seriInput.trim()) {
            setError('Vui lòng nhập số Seri để tra cứu.');
            return;
        }

        setLoading(true);
        try {
            const result = await fetchSanPhamBySeri(seriInput.trim());
            if (result.success) {
                setProductInfo(result.data);
            } else {
                // Handle errors reported by the API (e.g., not found)
                setError('Không tìm thấy thông tin sản phẩm.');
            }
        } catch (apiError) {
            // Handle network errors or other issues from fetchSanPhamBySeri
            setError(apiError.message || 'Đã xảy ra lỗi khi tra cứu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container className="my-4 min-vh-100">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <h1 className="text-center mb-4">Tra cứu thông tin bảo hành sản phẩm</h1>
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập số Seri sản phẩm"
                                    value={seriInput}
                                    onChange={handleInputChange}
                                    aria-label="Số Seri sản phẩm"
                                    disabled={loading}
                                />
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Tra cứu'}
                                </Button>
                            </InputGroup>
                        </Form>

                        {/* Display Loading State */}
                        {loading && (
                            <div className="text-center mt-3">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </Spinner>
                                <p>Đang tìm kiếm...</p>
                            </div>
                        )}

                        {/* Display Error Message */}
                        {error && !loading && (
                            <Alert variant="danger" className="mt-3">
                                {error}
                            </Alert>
                        )}

                        {/* Display Product Info Table */}
                        {productInfo && !loading && !error && (
                            <div className="mt-4">
                                <h4 className='text-center mb-3'>Thông tin sản phẩm và bảo hành</h4>
                                <Table striped bordered hover responsive>
                                    <tbody>
                                        <tr>
                                            <th style={{ width: '35%' }}>Tên Sản Phẩm</th>
                                            <td>{productInfo.TenHangHoa || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Ngày Mua Hàng</th>
                                            <td>{formatDate(productInfo.NgayXuatHoaDon)}</td>
                                        </tr>
                                        <tr>
                                            <th>Ngày Hết Hạn Bảo Hành</th>
                                            <td>{formatDate(productInfo.KetThucBaoHanh)}</td>
                                        </tr>
                                        <tr>
                                            <th>Thời Gian Bảo Hành</th>
                                            <td>{productInfo.ThoiGianBaoHanh != null ? `${productInfo.ThoiGianBaoHanh} tháng` : 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default TrangTraCuuSanPham;