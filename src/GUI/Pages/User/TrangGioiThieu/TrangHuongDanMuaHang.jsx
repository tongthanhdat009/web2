import Footer from "../Components/Footer";
function TrangHuongDanMuaHang(){
    return(
        <>
            <div className="container">
                <h1 className="my-4">Hướng dẫn mua hàng</h1>
                <p>Để giúp quý khách có trải nghiệm mua sắm thuận tiện và nhanh chóng, chúng tôi xin hướng dẫn các bước đặt hàng như sau:</p>
                
                <ol className="list-group list-group-numbered mb-4">
                    <li className="list-group-item d-flex justify-content-between align-items-start bg-transparent">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Chọn Sản Phẩm</div>
                            <ul className="list-unstyled mt-2">
                                <li>• Truy cập trang web và xem các sản phẩm trong danh mục.</li>
                                <li>• Nhấn vào sản phẩm để xem chi tiết thông tin và giá cả.</li>
                            </ul>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-start bg-transparent">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Thêm Vào Giỏ Hàng</div>
                            <ul className="list-unstyled mt-2">
                                <li>• Chọn số lượng mong muốn.</li>
                                <li>• Nhấn nút "Thêm vào giỏ hàng" để lưu sản phẩm vào giỏ hàng.</li>
                            </ul>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-start bg-transparent">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Kiểm Tra Giỏ Hàng</div>
                            <ul className="list-unstyled mt-2">
                                <li>• Vào mục "Giỏ hàng" để xem lại các sản phẩm đã chọn.</li>
                                <li>• Chỉnh sửa số lượng hoặc xóa sản phẩm nếu cần.</li>
                            </ul>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-start bg-transparent">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Thanh Toán Đơn Hàng</div>
                            <ul className="list-unstyled mt-2">
                                <li>• Nhấn nút "Thanh toán" và điền đầy đủ thông tin nhận hàng.</li>
                            </ul>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-start bg-transparent">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Nhận Thông Báo</div>
                            <ul className="list-unstyled mt-2">
                                <li>• Sau khi đặt hàng thành công, đơn hàng sẽ hiển thị trong phần hóa đơn đã mua</li>
                            </ul>
                        </div>
                    </li>
                </ol>
                
                <p>Mọi thắc mắc về đơn hàng vui lòng liên hệ với chúng tôi qua Email hoặc Hotline để được hỗ trợ nhanh chóng.</p>
                <p>Chúc quý khách có trải nghiệm mua sắm tuyệt vời!</p>
            </div>
        </>
    )
}
export default TrangHuongDanMuaHang;