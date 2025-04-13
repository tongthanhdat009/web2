import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faTruck, 
  faCreditCard, 
  faPhone, 
  faShoppingCart, 
  faShieldAlt, 
  faSearch,
  faBars,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

import './css/NavGioiThieuTrangWeb.css';

const NavGioiThieuTrangWeb = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const navItems = [
    { path: '/gioi-thieu', icon: faInfoCircle, title: 'Giới thiệu' },
    { path: '/van-chuyen', icon: faTruck, title: 'Vận chuyển' },
    { path: '/thanh-toan', icon: faCreditCard, title: 'Thanh toán' },
    { path: '/lien-he', icon: faPhone, title: 'Liên hệ' },
    { path: '/huong-dan-mua-hang', icon: faShoppingCart, title: 'Hướng dẫn mua hàng' },
    { path: '/chinh-sach-bao-hanh', icon: faShieldAlt, title: 'Chính sách bảo hành' },
    { path: '/tra-cuu-san-pham', icon: faSearch, title: 'Tra cứu sản phẩm' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
      if (window.innerWidth >= 600) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="card nav-container m-0">
      <div className="card-body p-0">
        {isMobile ? (
          <div className="bg-primary">
            <button 
              className="hamburger-button w-100 d-flex justify-content-between align-items-center text-white border-0 p-3"
              onClick={toggleMenu}
              style={{ backgroundColor: 'transparent' }}
            >
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="fs-4 me-2" />
                <span className="fs-5">Các thông tin cần biết</span>
              </div>
            </button>
            {isMenuOpen && (
              <ul className="nav nav-pills flex-column bg-primary m-0 p-0">
                {navItems.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''}`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? '#d2a679' : '',
                        color: 'white',
                        borderRadius: 0,
                        padding: '12px 16px',
                        fontWeight: '500'
                      })}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="me-2" />
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <ul className="nav nav-pills justify-content-end flex-column flex-md-row bg-primary">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? '#d2a679' : '',
                    color: 'white',
                    borderRadius: 0,
                    padding: '12px 16px',
                    fontWeight: '500'
                  })}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NavGioiThieuTrangWeb;