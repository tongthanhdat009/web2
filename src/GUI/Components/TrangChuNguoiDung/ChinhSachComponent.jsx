import React from 'react';

function ChinhSachComponent() {
  const policies = [
    {
      iconClass: "bi bi-truck display-3", 
      title: "GIAO HÀNG TOÀN QUỐC",
      description: "Cửa hàng nhận ship COD toàn quốc"
    },
    {
      iconClass: "bi bi-arrow-repeat display-3",
      title: "ĐỔI TRẢ HÀNG",
      description: <>Sản phẩm chưa sử dụng được phép<br/>Đổi trả trong vòng 7 ngày</> 
    },
    {
      iconClass: "bi bi-shield-check display-3",
      title: "CHÍNH SÁCH BẢO HÀNH",
      description: "Bảo hành keo chỉ trong vòng 3 tháng"
    },
    {
      iconClass: "bi bi-telephone display-3",
      title: "ĐẶT HÀNG ONLINE",
      description: "0832220222"
    }
  ];

  return (
    <div className="container my-2"> 
      <div className="row text-center"> 
        {policies.map((policy, index) => (
          <div className="col-6 col-md-3 mb-4" key={index}> {/* Responsive: 2 cột trên mobile, 4 cột trên desktop */}
            <i className={`${policy.iconClass} mb-3 d-inline-block`}></i>
            <h6 className="fw-bold mb-2 text-uppercase">{policy.title}</h6> 
            <p className="text-secondary small">{policy.description}</p> 
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChinhSachComponent;