import React from "react";

const TraCuuSanPham = () => {
  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "10px", width: "fit-content", height: "500px", padding:"20px" }}>
      <input
        type="text"
        placeholder="Nhập seri sản phẩm..."
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "transparent",
          outline: "none",
          fontSize: "16px",
          padding: "8px",
        }}
      />
    </div>
  );
};

export default TraCuuSanPham;
