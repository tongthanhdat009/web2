import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

function Footer(){
    const [isMobile, setIsMobile] = useState(window.innerWidth < 650);
    const [expandedSections, setExpandedSections] = useState({
        contact: false,
        policies: false
    });
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 650);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    return (
        <footer className="footer py-3" style={{height: 'fit-content'}}>
            <div className="container justify-content-center m-auto">
                <div className="row gy-2 w-100">
                    <div className="col-12 col-md-4">
                        {isMobile ? (
                            <div className="mb-2 ">
                                <div 
                                    className="d-fle justify-content-between align-items-center py-2 border-bottom pointer"
                                    onClick={() => toggleSection('contact')}
                                >
                                    <h5 className="text-dark m-0">Liên hệ</h5>
                                    <FontAwesomeIcon icon={expandedSections.contact ? faAngleUp : faAngleDown} />
                                </div>
                                
                                {expandedSections.contact && (
                                    <div className="pt-2">
                                        <p className="m-1 small">Địa chỉ: 123 Đường ABC, TP.HCM</p>
                                        <p className="m-1 small">Điện thoại: 0123456789</p>
                                        <p className="m-1 small">Email: dungcuthethao@gmail.com</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <h5 className="text-dark text-center">Liên hệ</h5>
                                <p className="m-1 text-center">Địa chỉ: 123 Đường ABC, TP.HCM</p>
                                <p className="m-1 text-center">Điện thoại: 0123456789</p>
                                <p className="m-1 text-center">Email: dungcuthethao@gmail.com</p>
                            </>
                        )}
                    </div>
                    
                    <div className="col-12 col-md-4 text-center">
                        <img 
                            src="/assets/logo1.png" 
                            alt="Logo" 
                            className="img-fluid mb-2" 
                            style={{ 
                                width: isMobile ? '100px' : '150px', 
                                height: isMobile ? '100px' : '150px' 
                            }} 
                        />
                        <h5 className="text-dark text-center d-none d-md-block">Theo dõi chúng tôi</h5>
                        <div className="social-icons d-inline-flex justify-content-center">
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark mx-2 fs-4">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark mx-2 fs-4">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark mx-2 fs-4">
                                <FontAwesomeIcon icon={faYoutube} />
                            </a>
                            <a href="mailto:dungcuthethao@gmail.com" className="text-decoration-none text-dark mx-2 fs-4">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-4">
                        {isMobile ? (
                            <div className="mb-2">
                                <div 
                                    className="d-flex justify-content-between align-items-center py-2 border-bottom pointer"
                                    onClick={() => toggleSection('policies')}
                                >
                                    <h5 className="text-dark m-0">Chính sách</h5>
                                    <FontAwesomeIcon icon={expandedSections.policies ? faAngleUp : faAngleDown} />
                                </div>
                                
                                {expandedSections.policies && (
                                    <div className="pt-2">
                                        <p className="m-1 small">
                                            <Link to="/chinh-sach-bao-hanh" className="text-decoration-none text-dark">
                                                Chính sách bảo hành
                                            </Link>
                                        </p>
                                        <p className="m-1 small">
                                            <Link to="/van-chuyen" className="text-decoration-none text-dark">
                                                Chính sách vận chuyển
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <h5 className="text-dark text-center">Chính sách</h5>
                                <p className="m-1 text-center">
                                    <Link to="/chinh-sach-bao-hanh" className="text-decoration-none text-dark">
                                        Chính sách bảo hành
                                    </Link>
                                </p>
                                <p className="m-1 text-center">
                                    <Link to="/van-chuyen" className="text-decoration-none text-dark">
                                        Chính sách vận chuyển
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-12 text-center">
                    <p className="m-0 text-secondary small">
                        &copy; {new Date().getFullYear()} Dụng Cụ Thể Thao. Tất cả quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;