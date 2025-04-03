import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const QuanLyPhanQuyen = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    idQuyen: null,
    tenQuyen: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost/web2/server/api/manageRoles.php");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setSnackbarMessage("Lỗi khi tải dữ liệu!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.idQuyen ? "PUT" : "POST";
    const url = "http://localhost/web2/server/api/manageRoles.php";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSnackbarMessage(formData.idQuyen ? "Cập nhật thành công!" : "Thêm mới thành công!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchRoles();
      setFormData({ idQuyen: null, tenQuyen: "" });
    } catch (error) {
      setSnackbarMessage("Lỗi khi lưu dữ liệu!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (role) => {
    setFormData(role);
  };

  const handleDelete = async (idQuyen) => {
    try {
      await fetch(`http://localhost/web2/server/api/manageRoles.php?IDQuyen=${idQuyen}`, {
        method: "DELETE",
      });
      setSnackbarMessage("Xóa thành công!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchRoles();
    } catch (error) {
      setSnackbarMessage("Lỗi khi xóa dữ liệu!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Quản lý phân quyền
      </Typography>
      <Paper style={{ padding: "1rem", marginBottom: "2rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem" }}>
          <TextField
            fullWidth
            label="Tên quyền"
            name="tenQuyen"
            value={formData.tenQuyen}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            {formData.idQuyen ? "Cập nhật" : "Thêm"}
          </Button>
        </form>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên quyền</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.IDQuyen}>
                <TableCell>{role.IDQuyen}</TableCell>
                <TableCell>{role.TenQuyen}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEdit(role)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(role.IDQuyen)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuanLyPhanQuyen;
