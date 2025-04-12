import { useEffect, useState } from "react";

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetch("http://localhost/web2/server/api/manageRoles.php")
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  const addRole = () => {
    fetch("http://localhost/web2/server/api/manageRoles.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TenQuyen: newRole }),
    }).then(() => {
      setRoles([...roles, { TenQuyen: newRole }]);
      setNewRole("");
    });
  };

  return (
    <div>
      <h2>Quản lý nhóm phân quyền</h2>
      <ul>
        {roles.map((role, index) => (
          <li key={index}>{role.TenQuyen}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        placeholder="Tên vai trò mới"
      />
      <button onClick={addRole}>Thêm vai trò</button>
    </div>
  );
}

export default RoleManagement;
