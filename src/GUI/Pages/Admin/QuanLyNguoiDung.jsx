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
} from "@mui/material";

const QuanLyNguoiDung = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    maNguoiDung: null,
    hoTen: "",
    gioiTinh: "Nam",
    email: "",
    soDienThoai: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost/web2/server/api/manageUsers.php");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.maNguoiDung ? "PUT" : "POST";
    const url = "http://localhost/web2/server/api/manageUsers.php";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSnackbarMessage(data.message);
        setSnackbarSeverity("success");
        fetchUsers();
        setFormData({ maNguoiDung: null, hoTen: "", gioiTinh: "Nam", email: "", soDienThoai: "" });
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

  const handleEdit = (user) => {
    setFormData({ ...user, maNguoiDung: Number(user.MaNguoiDung) });
  };

  const handleDelete = async (maNguoiDung) => {
    try {
      const response = await fetch("http://localhost/web2/server/api/manageUsers.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maNguoiDung }),
      });
      const data = await response.json();
      if (data.success) {
        setSnackbarMessage(data.message);
        setSnackbarSeverity("success");
        fetchUsers();
      } else {
        throw new Error(data.message || "Lỗi khi xóa dữ liệu!");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {isLoading && <CircularProgress />}
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <TextField fullWidth label="Họ tên" name="hoTen" value={formData.hoTen} onChange={handleChange} required />
          <Select fullWidth name="gioiTinh" value={formData.gioiTinh} onChange={handleChange} displayEmpty>
            <MenuItem value="Nam">Nam</MenuItem>
            <MenuItem value="Nữ">Nữ</MenuItem>
          </Select>
          <TextField fullWidth label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <TextField fullWidth label="Số điện thoại" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary">
            {formData.maNguoiDung ? "Cập nhật" : "Thêm"}
          </Button>
        </form>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Hành động</TableCell>
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
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleEdit(user)} style={{ marginRight: "0.5rem" }}>
                    Sửa
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(user.MaNguoiDung)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuanLyNguoiDung;
