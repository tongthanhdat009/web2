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

const QuanLyNguoiDung = () => {
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
    idQuyen: 2, // Mặc định là quyền người dùng thường
    anh: null,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

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
      // Tạo URL để xem trước ảnh
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Tạo FormData nếu có file ảnh
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
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpenDialog}
        sx={{ mb: 2 }}
      >
        Thêm người dùng
      </Button>
      
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
                <TableCell>{user.TenDangNhap}</TableCell>
                <TableCell>{user.IdQuyen === "1" ? "Admin" : "Người dùng"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      
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
                  <MenuItem value={1}>Admin</MenuItem>
                  <MenuItem value={2}>Người dùng</MenuItem>
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
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuanLyNguoiDung;