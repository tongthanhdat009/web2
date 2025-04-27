import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

function DanhMucNoiBat() {
    // --- Style objects ---
    const containerStyle = {
        display: 'flex',
        width: '80%',
        height: '50%',
        margin: 'auto',
        gap: '1rem'
    };
    const columnStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    };
    const imageStyle = {
        width: '100%',
        height: '180px',
        objectFit: 'constain',
        cursor: 'pointer'
    };

    // --- State cho đường dẫn ảnh ---
    const defaultPath = '/assets/AnhDanhMucNoiBat/default/';
    const hoverPath = '/assets/AnhDanhMucNoiBat/hover/';

    const [imgSrc1, setImgSrc1] = useState(defaultPath + '1.png');
    const [imgSrc2, setImgSrc2] = useState(defaultPath + '2.png');
    const [imgSrc3, setImgSrc3] = useState(defaultPath + '3.png');
    const [imgSrc4, setImgSrc4] = useState(defaultPath + '4.png');

    // 2. Khởi tạo navigate
    const navigate = useNavigate();

    // 3. Hàm xử lý click
    const handleClick = (maTheLoai) => {
        navigate(`/the-loai/${maTheLoai}`);
        // Lưu ý: Đường dẫn là '/the-loai/{MaTheLoai}' theo các ví dụ trước,
    };

    return (
        <div style={containerStyle}>
            {/* Cột 1 */}
            <div style={columnStyle}>
                {/* Ảnh 1 */}
                <img
                    src={imgSrc1}
                    alt="Danh mục nổi bật 1"
                    style={imageStyle}
                    onMouseEnter={() => setImgSrc1(hoverPath + '1.png')}
                    onMouseLeave={() => setImgSrc1(defaultPath + '1.png')}
                    onClick={() => handleClick(1)} 
                />
                {/* Ảnh 2 */}
                <img
                    src={imgSrc2}
                    alt="Danh mục nổi bật 2"
                    style={imageStyle}
                    onMouseEnter={() => setImgSrc2(hoverPath + '2.png')}
                    onMouseLeave={() => setImgSrc2(defaultPath + '2.png')}
                    onClick={() => handleClick(2)}
                />
            </div>

            {/* Cột 2 */}
            <div style={columnStyle}>
                {/* Ảnh 3 */}
                <img
                    src={imgSrc3}
                    alt="Danh mục nổi bật 3"
                    style={imageStyle}
                    onMouseEnter={() => setImgSrc3(hoverPath + '3.png')}
                    onMouseLeave={() => setImgSrc3(defaultPath + '3.png')}
                    onClick={() => handleClick(3)} 
                />
                {/* Ảnh 4 */}
                <img
                    src={imgSrc4}
                    alt="Danh mục nổi bật 4"
                    style={imageStyle}
                    onMouseEnter={() => setImgSrc4(hoverPath + '4.png')}
                    onMouseLeave={() => setImgSrc4(defaultPath + '4.png')}
                    onClick={() => handleClick(4)} 
                />
            </div>
        </div>
    );
}

export default DanhMucNoiBat;