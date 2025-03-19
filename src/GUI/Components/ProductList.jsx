import { useEffect, useState } from "react";
import { fetchHangHoa } from "../../DAL/api";

function ProductList() {
  const [hangHoa, setHangHoa] = useState([]);

  useEffect(() => {
    fetchHangHoa().then((data) => {
      console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu API trả về
      setHangHoa(data);
    });
  }, []);

  return (
    <div>
      <h2>Danh Sách Hàng Hóa</h2>
      <ul>
        {hangHoa.map((product, index) => (
          <li key={product.maHangHoa || `product-${index}`}>
            <strong>{product.tenHangHoa}</strong> - {product.moTa}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
