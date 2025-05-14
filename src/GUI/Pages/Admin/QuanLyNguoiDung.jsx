import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Box,
  Grid,
} from "@mui/material";

const QuanLyNguoiDung = ({Them, Xoa, Sua}) => {
  console.log(Them, Xoa, Sua);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    maNguoiDung: null,
    hoTen: "",
    gioiTinh: "Nam",
    email: "",
    soDienThoai: "",
    tenDangNhap: "",
    matKhau: "",
    idQuyen: 2,
    anh: null,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [quyenList, setQuyenList] = useState([]);

  // Dialog sửa
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    idTaiKhoan: "",
    hoTen: "",
    gioiTinh: "Nam",
    email: "",
    soDienThoai: "",
    idQuyen: "",
    matKhau: "",
  });

  // Lấy danh sách quyền từ API
  useEffect(() => {
    const fetchQuyen = async () => {
      try {
        const res = await fetch("http://localhost/web2/server/api/QuanLyQuyen/getQuyen.php");
        const data = await res.json();
        if (data.success) setQuyenList(data.data);
        else setQuyenList([]);
      } catch (e) {
        setQuyenList([]);
      }
    };
    fetchQuyen();
  }, []);

  const fetchUsers = async (query = "") => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost/web2/server/api/manageUsers.php?keyword=${query}`
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.message || "Lỗi khi tải dữ liệu!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, anh: file });
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let requestData;
    let headers = {};
    let method = "POST";

    if (formData.anh instanceof File) {
      requestData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'anh') {
          requestData.append('anh', formData.anh);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          requestData.append(key, formData[key]);
        }
      });
    } else {
      requestData = JSON.stringify(formData);
      headers = { "Content-Type": "application/json" };
    }

    const url = "http://localhost/web2/server/api/manageUsers.php";

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestData,
      });

      const data = await response.json();

      if (data.success) {
        setSnackbarMessage(data.message);
        setSnackbarSeverity("success");
        resetForm();
        fetchUsers();
        setOpenDialog(false);
      } else {
        throw new Error(data.message || "Lỗi khi lưu dữ liệu!");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setFormData({
      maNguoiDung: null,
      hoTen: "",
      gioiTinh: "Nam",
      email: "",
      soDienThoai: "",
      tenDangNhap: "",
      matKhau: "",
      idQuyen: 2,
      anh: null,
    });
    setPreviewImage(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  // ====== SỬA NGƯỜI DÙNG ======
  const handleOpenEdit = (user) => {
    // Lấy id quyền từ user (ưu tiên IDQuyen, IdQuyen, idQuyen)
    let userQuyen =
      user.IDQuyen ??
      user.IdQuyen ??
      user.idQuyen ??
      quyenList.find(q => q.TenQuyen === user.TenQ)?.IDQuyen ??
      "";

    setEditForm({
      idTaiKhoan: user.IDTaiKhoan || user.MaNguoiDung || "",
      hoTen: user.HoTen || "",
      gioiTinh: user.GioiTinh || "Nam",
      email: user.Email || "",
      soDienThoai: user.SoDienThoai || "",
      idQuyen: String(userQuyen), // luôn là string để Select hoạt động đúng
      matKhau: "",
    });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.matKhau && editForm.matKhau.length < 6) {
      setSnackbarMessage("Mật khẩu mới phải có ít nhất 6 ký tự!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const payload = {
      IDTaiKhoan: editForm.idTaiKhoan,
      HoTen: editForm.hoTen,
      GioiTinh: editForm.gioiTinh,
      Email: editForm.email,
      SoDienThoai: editForm.soDienThoai,
      IDQuyen: editForm.idQuyen,
    };
    if (editForm.matKhau && editForm.matKhau.trim() !== "") {
      payload.MatKhau = editForm.matKhau;
    }
    try {
      const res = await fetch("http://localhost/web2/server/api/updateTaiKhoan.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSnackbarMessage(data.success ? "Cập nhật thành công!" : data.message || "Cập nhật thất bại!");
      setSnackbarSeverity(data.success ? "success" : "error");
      setOpenSnackbar(true);
      if (data.success) {
        setOpenEdit(false);
        fetchUsers();
      }
    } catch {
      setSnackbarMessage("Có lỗi xảy ra!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // ====== KHÓA/MỞ KHÓA ======
  const handleToggleLock = async (user) => {
    const res = await fetch("http://localhost/web2/server/api/khoaTaiKhoan.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IDTaiKhoan: user.IDTaiKhoan || user.MaNguoiDung,
        TrangThai: user.TrangThai === 1 ? 0 : 1,
      }),
    });
    const data = await res.json();
    setSnackbarMessage(
      data.success
        ? user.TrangThai === 1
          ? "Đã khóa tài khoản!"
          : "Đã mở khóa tài khoản!"
        : data.message || "Thao tác thất bại!"
    );
    setSnackbarSeverity(data.success ? "success" : "error");
    setOpenSnackbar(true);
    if (data.success) fetchUsers();
  };

  return (
    <Container style={{ minHeight: "500px", backgroundColor: "#ffffff", borderRadius: "10px", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>
      
      <Box mb={3} display="flex" gap={2}>
        <TextField
          fullWidth
          label="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />
        <Button 
          variant="contained" 
          onClick={() => fetchUsers(searchTerm)}
          sx={{ mt: 2 }}
        >
          Tìm kiếm
        </Button>
      </Box>
      
        {Them === 1 && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpenDialog}
            sx={{ mb: 2 }}
          >
            Thêm người dùng
          </Button>
        )}
      
      {isLoading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mt: 2, overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Quyền</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.MaNguoiDung}>
                <TableCell>{user.MaNguoiDung}</TableCell>
                <TableCell>{user.HoTen}</TableCell>
                <TableCell>{user.GioiTinh}</TableCell>
                <TableCell>{user.Email}</TableCell>
                <TableCell>{user.SoDienThoai}</TableCell>
                <TableCell>{user.TaiKhoan}</TableCell>
                <TableCell>{user.TenQuyen}</TableCell>
                <TableCell>
                  {Sua === 1 && (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenEdit(user)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        color={user.TrangThai === 1 ? "error" : "success"}
                        size="small"
                        onClick={() => handleToggleLock(user)}
                      >
                        {user.TrangThai === 1 ? "Khóa" : "Mở khóa"}
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      
      {/* Dialog thêm tài khoản giữ nguyên */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Thêm người dùng</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Họ tên" 
                name="hoTen" 
                value={formData.hoTen} 
                onChange={handleChange} 
                required 
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="gioiTinh-label">Giới tính</InputLabel>
                <Select
                  labelId="gioiTinh-label"
                  name="gioiTinh"
                  value={formData.gioiTinh}
                  onChange={handleChange}
                  label="Giới tính"
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Email" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                required 
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Số điện thoại" 
                name="soDienThoai" 
                value={formData.soDienThoai} 
                onChange={handleChange} 
                required 
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Tên đăng nhập" 
                name="tenDangNhap" 
                value={formData.tenDangNhap} 
                onChange={handleChange} 
                required 
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                label="Mật khẩu" 
                name="matKhau" 
                type="password" 
                value={formData.matKhau} 
                onChange={handleChange} 
                required 
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="idQuyen-label">Quyền</InputLabel>
                <Select
                  labelId="idQuyen-label"
                  name="idQuyen"
                  value={formData.idQuyen}
                  onChange={handleChange}
                  label="Quyền"
                >
                  {quyenList.map((q) => (
                    <MenuItem key={q.IDQuyen} value={q.IDQuyen}>
                      {q.TenQuyen}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
              >
                Tải lên ảnh đại diện
                <input
                  type="file"
                  name="anh"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {previewImage && (
                <Box mt={2} textAlign="center">
                  <img 
                    src={previewImage} 
                    alt="Xem trước" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog sửa tài khoản */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sửa người dùng</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ tên"
                name="hoTen"
                value={editForm.hoTen}
                onChange={handleEditChange}
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="gioiTinh-label-edit">Giới tính</InputLabel>
                <Select
                  labelId="gioiTinh-label-edit"
                  name="gioiTinh"
                  value={editForm.gioiTinh}
                  onChange={handleEditChange}
                  label="Giới tính"
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="soDienThoai"
                value={editForm.soDienThoai}
                onChange={handleEditChange}
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="idQuyen-label-edit">Quyền</InputLabel>
                <Select
                  labelId="idQuyen-label-edit"
                  name="idQuyen"
                  value={editForm.idQuyen}
                  onChange={handleEditChange}
                  label="Quyền"
                >
                  {quyenList.map((q) => (
                    <MenuItem key={q.IDQuyen} value={q.IDQuyen}>
                      {q.TenQuyen}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mật khẩu mới"
                name="matKhau"
                type="password"
                value={editForm.matKhau}
                onChange={handleEditChange}
                margin="dense"
                placeholder="Để trống nếu không đổi"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Hủy</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuanLyNguoiDung;