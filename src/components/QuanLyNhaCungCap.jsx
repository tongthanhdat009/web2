import React, { useState, useEffect } from 'react';
import { fetchNCC, addNCC, updateNCC, deleteNCC } from '../DAL/api';
import NhaCungCapDTO from '../DTO/NhaCungCapDTO';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QuanLyNhaCungCap() {
    const [nhaCungCaps, setNhaCungCaps] = useState([]);
    const [selectedNCC, setSelectedNCC] = useState(null);
    const [formData, setFormData] = useState({
        MaNhaCungCap: '',
        TenNhaCungCap: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNhaCungCaps();
    }, []);

    const loadNhaCungCaps = async () => {
        try {
            setLoading(true);
            const response = await fetchNCC();
            if (response.success) {
                setNhaCungCaps(response.data || []);
            } else {
                toast.error(response.message || 'Lỗi khi tải dữ liệu');
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const nccDTO = new NhaCungCapDTO(formData);
            let response;
            
            if (selectedNCC) {
                response = await updateNCC(nccDTO);
            } else {
                response = await addNCC(nccDTO);
            }

            if (response.success) {
                toast.success(response.message);
                resetForm();
                loadNhaCungCaps();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (ncc) => {
        setSelectedNCC(ncc);
        setFormData({
            MaNhaCungCap: ncc.MaNhaCungCap,
            TenNhaCungCap: ncc.TenNhaCungCap
        });
    };

    const handleDelete = async (maNCC) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
            try {
                setLoading(true);
                const response = await deleteNCC(maNCC);
                if (response.success) {
                    toast.success(response.message);
                    loadNhaCungCaps();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Lỗi:', error);
                toast.error('Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setSelectedNCC(null);
        setFormData({
            MaNhaCungCap: '',
            TenNhaCungCap: ''
        });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Quản lý nhà cung cấp</h2>
            
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Mã nhà cung cấp</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="MaNhaCungCap"
                                    value={formData.MaNhaCungCap}
                                    onChange={handleInputChange}
                                    disabled={selectedNCC}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Tên nhà cung cấp</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="TenNhaCungCap"
                                    value={formData.TenNhaCungCap}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                                {selectedNCC ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            {selectedNCC && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Mã nhà cung cấp</th>
                                        <th>Tên nhà cung cấp</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nhaCungCaps.map((ncc) => (
                                        <tr key={ncc.MaNhaCungCap}>
                                            <td>{ncc.MaNhaCungCap}</td>
                                            <td>{ncc.TenNhaCungCap}</td>
                                            <td>
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => handleEdit(ncc)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(ncc.MaNhaCungCap)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {nhaCungCaps.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuanLyNhaCungCap; 