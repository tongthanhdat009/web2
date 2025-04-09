import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const API_BASE_URL = "http://localhost/web2/server/api";

const QuanLyPhanQuyen = () => {
  const [roles, setRoles] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [formData, setFormData] = useState({
    idQuyen: null,
    tenQuyen: "",
    moTa: "",
    trangThai: 1,
    phanQuyen: []
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSystemRoles, setShowSystemRoles] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Hiển thị thông báo
  const showNotification = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Fetch cả quyền và chức năng
  const fetchData = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        system: showSystemRoles
      });

      const response = await fetch(`${API_BASE_URL}/manageRoles.php?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        setRoles(result.data);
        setPagination({
          ...pagination,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        });
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  }, [pagination.page, pagination.limit, searchQuery, showSystemRoles]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (functionId, type) => (event) => {
    const { checked } = event.target;
    setFormData(prevData => {
      const updatedPermissions = [...prevData.phanQuyen];
      const permissionIndex = updatedPermissions.findIndex(p => p.idChucNang === functionId);

      if (permissionIndex === -1) {
        // Khởi tạo permission mới với tất cả quyền là 0
        updatedPermissions.push({
          idChucNang: functionId,
          them: 0,
          xoa: 0,
          sua: 0,
          [type]: checked ? 1 : 0
        });
      } else {
        // Cập nhật quyền hiện có
        updatedPermissions[permissionIndex] = {
          ...updatedPermissions[permissionIndex],
          [type]: checked ? 1 : 0
        };
      }

      return { ...prevData, phanQuyen: updatedPermissions };
    });
  };

  const validateForm = () => {
    if (!formData.tenQuyen.trim()) {
      showNotification("Vui lòng nhập tên quyền", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/manageRoles.php`, {
        method: formData.idQuyen ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          trangThai: Number(formData.trangThai)
        }),
      });

      const result = await response.json();

      if (result.success) {
        showNotification(result.message);
        fetchData();
        handleCloseDialog();
      } else {
        showNotification(result.message, "error");
        if (result.code === "NO_PERMISSION") {
          handleCloseDialog();
        }
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleEdit = (role) => {
    // Chuyển đổi định dạng dữ liệu từ API sang formData
    setFormData({
      idQuyen: parseInt(role.IDQuyen),
      tenQuyen: role.TenQuyen,
      moTa: role.MoTa || "",
      trangThai: role.TrangThai ? 1 : 0,
      phanQuyen: role.ChucNang.map(cn => ({
        idChucNang: parseInt(cn.IDChucNang),
        them: parseInt(cn.Them || 0),
        xoa: parseInt(cn.Xoa || 0),
        sua: parseInt(cn.Sua || 0)
      }))
    });
    setOpenDialog(true);
  };

  const handleDelete = async (idQuyen) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa quyền này?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/manageRoles.php?IDQuyen=${idQuyen}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      
      showNotification(result.message, result.success ? "success" : "error");
      
      if (result.success) {
        await fetchData();
      }
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
      showNotification("Lỗi khi xóa dữ liệu: " + error.message, "error");
    }
  };

  const resetForm = () => {
    setFormData({
      idQuyen: null,
      tenQuyen: "",
      moTa: "",
      trangThai: 1,
      phanQuyen: []
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Component hiển thị quyền chi tiết cho mỗi chức năng
  const RolePermissionChips = ({ permission }) => (
    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
      {permission.Them === 1 && <Chip label="Thêm" size="small" color="primary" />}
      {permission.Sua === 1 && <Chip label="Sửa" size="small" color="info" />}
      {permission.Xoa === 1 && <Chip label="Xóa" size="small" color="error" />}
    </Box>
  );

  // Render phần Card hiển thị quyền
  const RoleCard = ({ role }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: role.HeTHong ? 'action.selected' : 'background.paper'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {role.TenQuyen}
            {role.HeTHong && (
              <Chip 
                label="Hệ thống" 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Chip 
            label={role.TrangThai ? "Đang hoạt động" : "Đã khóa"}
            color={role.TrangThai ? "success" : "error"}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {role.MoTa || "Không có mô tả"}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {role.ChucNang.map(nhom => (
          <Box key={nhom.TenNhom} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {nhom.TenNhom}
            </Typography>
            {nhom.DanhSachChucNang.map(cn => (
              <Box key={cn.IDChucNang} sx={{ ml: 2, mb: 1 }}>
                <Typography variant="body2">
                  {cn.TenChucNang}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  {cn.Them === 1 && <Chip label="Thêm" size="small" color="primary" />}
                  {cn.Sua === 1 && <Chip label="Sửa" size="small" color="info" />}
                  {cn.Xoa === 1 && <Chip label="Xóa" size="small" color="error" />}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </CardContent>
      
      {!role.HeTHong && (
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={() => handleEdit(role)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(role.IDQuyen)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Quản lý phân quyền
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Thêm quyền mới
        </Button>
      </Box>

      {/* Grid layout for roles */}
      <Grid container spacing={3}>
        {roles.length > 0 ? (
          roles.map((role) => (
            <Grid item xs={12} md={6} lg={4} key={role.IDQuyen}>
              <RoleCard role={role} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              Chưa có quyền nào được tạo
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Dialog for add/edit role */}
      <Dialog 
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {formData.idQuyen ? "Sửa quyền" : "Thêm quyền mới"}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tên quyền"
              name="tenQuyen"
              value={formData.tenQuyen}
              onChange={handleChange}
              required
              error={!formData.tenQuyen.trim()}
              helperText={!formData.tenQuyen.trim() ? "Tên quyền không được để trống" : ""}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Mô tả"
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.trangThai === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.checked ? 1 : 0 }))}
                  color="primary"
                />
              }
              label="Đang hoạt động"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="h6" gutterBottom>
              Phân quyền chi tiết
            </Typography>
            
            {functions.length > 0 ? (
              <Grid container spacing={2}>
                {functions.map((func) => {
                  const permission = formData.phanQuyen.find(
                    (p) => p.idChucNang === func.IDChucNang
                  );
                  return (
                    <Grid item xs={12} sm={6} key={func.IDChucNang}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {func.TenChucNang}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={permission?.them === 1}
                                  onChange={handlePermissionChange(func.IDChucNang, 'them')}
                                  color="primary"
                                />
                              }
                              label="Thêm"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={permission?.sua === 1}
                                  onChange={handlePermissionChange(func.IDChucNang, 'sua')}
                                  color="info"
                                />
                              }
                              label="Sửa"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={permission?.xoa === 1}
                                  onChange={handlePermissionChange(func.IDChucNang, 'xoa')}
                                  color="error"
                                />
                              }
                              label="Xóa"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Đang tải danh sách chức năng...
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : formData.idQuyen ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuanLyPhanQuyen;