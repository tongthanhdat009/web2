import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get("http://localhost/reactweb/src/db/DAO/nguoiDungDAO.php")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  // Gửi user mới lên backend
  const addUser = () => {
    axios.post("http://localhost/reactweb/src/db/DAO/add_user.php", { name, email })
      .then(response => {
        alert(response.data.message);
        setUsers([...users, { id: response.data.userId, name, email }]);
        setName("");
        setEmail("");
      })
      .catch(error => {
        console.error("Lỗi khi thêm user:", error);
        alert("Lỗi khi thêm user: " + error.message);
      });
  };

  return (
    <div className="container">
      <h2>Danh sách Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.HoTen} - {user.Email}</li>
        ))}
      </ul>

      <h2>Thêm User</h2>
      <input type="text" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={addUser}>Thêm</button>

      <div className="container mt-4">
      <h2 className="text-center">Danh Sách Hội Viên</h2>
      <table className="table table-striped table-bordered" border={1}>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Nguyễn Văn A</td>
            <td>nguyenvana@example.com</td>
            <td className="text-success">Hoạt động</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Trần Thị B</td>
            <td>tranthib@example.com</td>
            <td className="text-danger">Bị khóa</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
    
  );
}

export default App;