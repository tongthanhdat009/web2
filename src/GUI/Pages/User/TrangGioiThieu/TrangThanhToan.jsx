import NavGioiThieuTrangWeb from "../Components/NavGioiThieuTrangWeb";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
function TrangThanhToan(){
    return(
        <>
            <div className="container">
                <h1 className="my-3">Thanh Toán</h1>
                <div className="text-center mb-3">
                    <img src="public\assets\AnhTrangGioiThieu\thanhtoan.png" className="w-25"/>
                </div>
                <p>Để mang đến sự tiện lợi và trải nghiệm mua sắm tốt nhất, chúng tôi cung cấp các hình thức thanh toán linh hoạt và an toàn:</p>
                <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item bg-transparent"><strong>Thanh toán khi nhận hàng (COD):</strong> Khách hàng thanh toán trực tiếp cho nhân viên giao hàng khi nhận sản phẩm.</li>
                    <li className="list-group-item bg-transparent"><strong>Chuyển khoản ngân hàng:</strong> Thực hiện thanh toán qua tài khoản ngân hàng theo thông tin được cung cấp sau khi đặt hàng.</li>
                    <li className="list-group-item bg-transparent"><strong>Thanh toán qua ví điện tử:</strong> Hỗ trợ các ví điện tử phổ biến như Momo, ZaloPay, ViettelPay.</li>
                    <li className="list-group-item bg-transparent"><strong>Thanh toán online qua thẻ ngân hàng:</strong> Chấp nhận thanh toán qua thẻ tín dụng, thẻ ghi nợ (Visa, MasterCard).</li>
                </ul>
                
                <p>Mọi giao dịch đều được bảo mật thông tin để đảm bảo an toàn tuyệt đối cho khách hàng.</p>
                <p>Hãy yên tâm mua sắm với những phương thức thanh toán tiện lợi và nhanh chóng của chúng tôi!</p>
            </div>
        </>
    )
}
export default TrangThanhToan;