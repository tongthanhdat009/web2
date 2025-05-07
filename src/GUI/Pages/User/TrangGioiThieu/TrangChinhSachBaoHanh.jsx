function TrangChinhSachBaoHanh(){
    return(
        <div className="d-flex flex-column min-vh-100">
            <div className="container flex-grow-1 mb-5">
                <h1 className="mt-3 mb-4">Chính sách bảo hành</h1>
                <div className="text-center mb-4">
                    <img 
                    src="public\assets\AnhTrangGioiThieu\ChinhSachBaoHanh.png" 
                    className="img-fluid" 
                    alt="Chính sách bảo hành"
                    style={{width: "400px", height:"400px"}}/>
                </div>
                
                <ol className="list-group list-group-flush mb-4">
                    <li className="list-group-item bg-transparent">
                        <h5>Thời gian bảo hành</h5>
                        <ul className="list-unstyled ps-3">
                            <li>• Thời gian bảo hành áp dụng theo từng sản phẩm, từ 3 tháng đến 2 năm tùy theo nhà sản xuất.</li>
                            <li>• Thời gian bảo hành được tính từ ngày khách hàng mua sản phẩm (dựa trên hóa đơn hoặc phiếu bảo hành).</li>
                        </ul>
                    </li>
                    
                    <li className="list-group-item bg-transparent">
                        <h5>Điều kiện bảo hành</h5>
                        <ul className="list-unstyled ps-3">
                            <li>• Lỗi kỹ thuật do nhà sản xuất.</li>
                            <li>• Sản phẩm còn trong thời gian bảo hành.</li>
                            <li>• Sản phẩm có đầy đủ hóa đơn hoặc phiếu bảo hành.</li>
                        </ul>
                    </li>
                    
                    <li className="list-group-item bg-transparent">
                        <h5>Trường hợp không được bảo hành</h5>
                        <ul className="list-unstyled ps-3">
                            <li>• Sản phẩm bị hư hỏng do sử dụng sai cách, va đập mạnh, rơi vỡ, bảo quản không đúng điều kiện khuyến nghị.</li>
                            <li>• Sản phẩm bị cháy, nổ, biến dạng do tác động ngoại lực, thiên tai, hỏa hoạn.</li>
                            <li>• Sản phẩm đã bị can thiệp sửa chữa bởi bên thứ ba không phải do cửa hàng hoặc nhà sản xuất ủy quyền.</li>
                        </ul>
                    </li>
                    
                    <li className="list-group-item bg-transparent">
                        <h5>Hình thức bảo hành</h5>
                        <ul className="list-unstyled ps-3">
                            <li>• Sản phẩm sẽ được sửa chữa hoặc thay thế linh kiện miễn phí theo chính sách của nhà sản xuất.</li>
                            <li>• Trường hợp không thể sửa chữa, khách hàng có thể được đổi sang sản phẩm tương đương hoặc nhận hỗ trợ theo thỏa thuận với cửa hàng.</li>
                        </ul>
                    </li>
                    
                    <li className="list-group-item bg-transparent">
                        <h5>Hướng dẫn bảo hành</h5>
                        <ul className="list-unstyled ps-3">
                            <li>• Khách hàng vui lòng mang sản phẩm đến cửa hàng hoặc liên hệ với bộ phận hỗ trợ để được hướng dẫn cụ thể.</li>
                            <li>• Thời gian xử lý bảo hành thông thường từ 3 - 15 ngày làm việc, tùy theo mức độ hư hỏng và chính sách của nhà sản xuất.</li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>
    )
}
export default TrangChinhSachBaoHanh;