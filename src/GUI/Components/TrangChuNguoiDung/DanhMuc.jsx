import React, { useState, useEffect } from 'react';
// Thêm Modal vào import
import { Navbar, Nav, Container, Row, Col, ListGroup, Image, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/DanhMuc.css';
import { getChungLoaiVaTheLoai } from '../../../DAL/apiTrangChuUser';

const THE_LOAI_CHINH = [
    { MaTheLoai: 1, Ten: 'Các thiết bị tạ' },
    { MaTheLoai: 2, Ten: 'Thiết bị cardio' },
    { MaTheLoai: 3, Ten: 'Thời trang thể thao' },
    { MaTheLoai: 4, Ten: 'Thực phẩm chức năng' },
    { MaTheLoai: 5, Ten: 'Các thiết bị khác' },
];

// Không cần CustomDropdown nữa

function DanhMuc() {
    const [chungLoaiData, setChungLoaiData] = useState([]);
    const [loadingData, setLoadingData] = useState(true); // Đổi tên loading state
    const [error, setError] = useState(null);

    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedMaTheLoai, setSelectedMaTheLoai] = useState(null); // Lưu mã thể loại đang chọn

    // Hàm mở Modal
    const handleShowModal = (maTheLoai, event) => {
        event.preventDefault(); // Ngăn Link điều hướng khi chỉ muốn mở modal
        setSelectedMaTheLoai(maTheLoai);
        setShowModal(true);
    };

    // Hàm đóng Modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMaTheLoai(null); // Reset khi đóng
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true); // Sử dụng state loading mới
            setError(null);
            try {
                const data = await getChungLoaiVaTheLoai();
                if (data) {
                    // Xử lý dữ liệu (có thể bỏ qua việc thêm TenTheLoai nếu không cần nữa)
                    setChungLoaiData(data);
                } else {
                    setError("Không thể tải dữ liệu danh mục.");
                    setChungLoaiData([]);
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu danh mục.");
                console.error(err);
                setChungLoaiData([]);
            } finally {
                setLoadingData(false); // Sử dụng state loading mới
            }
        };
        fetchData();
    }, []);

    // Hàm render nội dung BÊN TRONG Modal (tương tự renderCategoryDropdownContent cũ)
    const renderModalContent = (maTheLoai) => {
        // Kiểm tra nếu chưa chọn thể loại (tránh lỗi khi modal mới mở)
        if (maTheLoai === null) return null;

        const subCategories = chungLoaiData.filter(item => item.MaTheLoai === maTheLoai);
        const currentTheLoai = THE_LOAI_CHINH.find(tl => tl.MaTheLoai === maTheLoai);
        const tenTheLoaiHienTai = currentTheLoai ? currentTheLoai.Ten : 'Danh mục';

        // Sử dụng loadingData state
        if (loadingData) return <Spinner animation="border" size="sm" className="m-3" />;
        if (error) return <div className="p-3 text-danger">Lỗi tải danh mục con.</div>;

        return (
            <Row>
                <Col md={4} className="category-list-col" >
                    <div className="d-flex justify-content-between align-items-center mb-2 category-list-header">
                        <h6 className="mb-0 text-uppercase">{tenTheLoaiHienTai}</h6>
                        <Link to={`/the-loai/${maTheLoai}`} className="view-all-link" onClick={handleCloseModal}>
                            Xem tất cả
                        </Link>
                    </div>
                    {subCategories.length > 0 ? (
                        <ListGroup variant="flush">
                            {subCategories.map((subCategory) => (
                                <ListGroup.Item
                                    as={Link}
                                    // Link này cũng cần đóng modal
                                    to={`/the-loai/${maTheLoai}/${subCategory.MaChungLoai}`}
                                    key={subCategory.MaChungLoai}
                                    action
                                    className="category-list-item"
                                    onClick={handleCloseModal} // Đóng modal khi click vào chủng loại
                                >
                                    {subCategory.TenChungLoai}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-muted mt-2">Không có danh mục con.</p>
                    )}
                </Col>

                {/* Cột phải: Ảnh quảng cáo */}
                <Col md={8} className="promo-image-col d-none d-md-block">
                    {/* Link này cũng cần đóng modal */}
                    <Link to={`/the-loai/${maTheLoai}`} onClick={handleCloseModal}>
                        <Image
                            src={`/assets/AnhDanhMuc/${maTheLoai}.png`}
                            fluid
                            alt={`Quảng cáo ${tenTheLoaiHienTai}`}
                            className="promo-image"
                        />
                    </Link>
                </Col>
            </Row>
        );
    };

    return (
        <>
          <Navbar bg="light" expand="lg" className="danh-muc-navbar" style={{height: 'fit-content'}}>
              <Container>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                      {/* Thay đổi className ở đây */}
                      <Nav className="justify-content-center flex-grow-1"> {/* Sử dụng justify-content-center */}
                          {/* Map qua các thể loại chính để tạo Nav.Link */}
                          {THE_LOAI_CHINH.map(theLoai => (
                              <Nav.Link
                                  key={theLoai.MaTheLoai}
                                  as={Link}
                                  to={`/the-loai/${theLoai.MaTheLoai}`}
                                  onClick={(e) => handleShowModal(theLoai.MaTheLoai, e)}
                                  className="nav-link-category mx-4"
                              >
                                  {theLoai.Ten}
                              </Nav.Link>
                          ))}
                          {/* <Nav.Link href="#sale" className="promo-highlight">
                            🔥 Khuyến Mãi
                          </Nav.Link> */}
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>

          {/* Modal hiển thị nội dung */}
          <Modal
              show={showModal}
              onHide={handleCloseModal}
              centered
              dialogClassName="category-modal"
              size='xl' // Hoặc size='lg' tùy bạn chọn
          >
              <Modal.Header closeButton>
                  {/* <Modal.Title>Danh mục</Modal.Title> */}
              </Modal.Header>
              <Modal.Body>
                  {renderModalContent(selectedMaTheLoai)}
              </Modal.Body>
          </Modal>
      </>
    );
}

export default DanhMuc;