import { useState, useEffect } from 'react';

const usePermission = (chucNangId) => {
  const [permissions, setPermissions] = useState({
    them: false,
    xoa: false,
    sua: false
  });

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Lấy thông tin user từ localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
          setPermissions({ them: false, xoa: false, sua: false });
          return;
        }

        // Gọi API để lấy quyền của user
        const response = await fetch(`/api/permissions/${userInfo.IDTaiKhoan}/${chucNangId}`);
        const data = await response.json();

        if (data.success) {
          setPermissions({
            them: data.permissions.them === 1,
            xoa: data.permissions.xoa === 1,
            sua: data.permissions.sua === 1
          });
        } else {
          setPermissions({ them: false, xoa: false, sua: false });
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        setPermissions({ them: false, xoa: false, sua: false });
      }
    };

    checkPermission();
  }, [chucNangId]);

  return permissions;
};

export default usePermission; 