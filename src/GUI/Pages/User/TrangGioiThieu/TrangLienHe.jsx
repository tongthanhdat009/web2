import NavGioiThieuTrangWeb from "../Components/NavGioiThieuTrangWeb";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
function TrangLienHe(){
    return(
        <>
            <div className="container min-vh-100">
                <h1 className="my-4">Liên Hệ</h1>
                <p>Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của quý khách hàng.</p>
                
                <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item bg-transparent"><strong>Địa chỉ:</strong> Cơ sở chính Trường Đại học Sài Gòn</li>
                    <li className="list-group-item bg-transparent"><strong>Số điện thoại tư vấn, đặt hàng:</strong> Đang cập nhật</li>
                    <li className="list-group-item bg-transparent"><strong>Email:</strong> cuahangdungcuthethao@gmail.com</li>
                </ul>
                
                <p>Quý khách có thể liên hệ với chúng tôi qua các kênh trên để được tư vấn, đặt hàng hoặc hỗ trợ thông tin chi tiết về sản phẩm.</p>
                <p>Sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi!</p>
            </div>
        </>
    )
}
export default TrangLienHe;