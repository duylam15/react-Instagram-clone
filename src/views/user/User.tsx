import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
  CPaginationItem,
  CPagination
} from "@coreui/react";
import { addUser, getListUser, getListUserByword, getUserRole, updateActive, updateUser, updateUserRole, validateUser } from "../../services/user/user";
import AlertMessage from "../../components/Notifications/alertMessage";

type UserType = {
  userId: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  isOnline: boolean;
  isActive: boolean;
};

function containsKeyword(str: string, keyword: string): boolean {
  return str.toLowerCase().includes(keyword.toLowerCase());
}


const User = () => {

  const [alert, setAlert] = useState<{ message: string; severity: "success" | "warning" | "info" | "danger"; key: number } | null>(null);

  const showAlert = (message: string, severity: "success" | "warning" | "info" | "danger") => {
    console.log("Show Alert:", message, severity);

    setAlert({ message, severity, key: Date.now() }); // 🔥 Thay đổi key để ép re-render

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const [userRoles, setUserRoles] = useState<{ userId: number; role: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);
  const [newUser, setNewUser] = useState<UserType>({
    userId: 0,
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    isOnline: false,
    isActive: false
  });


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 10; // Số lượng người dùng mỗi trang


  const userRole = async (idUser : number) => {
    try{
      const response = await getUserRole(idUser);
      console.log(response?.data[0].name);
      return response?.data[0].name
    } catch (err) {
      return "no role";
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = {
          page: currentPage - 1,
          size: pageSize
        }
        const response = await getListUser(data);
        setUsers(response.data);
        setTotalPages(response.totalPage);
        setTotalUsers(response.totalElements);
        const fetchRoles = async () => {
          let roles: { userId: number; role: string }[] = [];
          const rolePromises = response.data.map(async (user: any) => {
            const role = await userRole(user.userId); // chờ kết quả Promise
            return {
              userId: user.userId,
              role: role, // đã là string
            };
          });
        
          roles = await Promise.all(rolePromises);
          setUserRoles(roles);
        };
        fetchRoles();
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu người dùng:", err);
      }
    };
    if (searchTerm == "")
      fetchUsers();
  }, [currentPage, loading]);

  const getRoleByUserId = (userId: number) => {
    return userRoles.find(r => r.userId === userId)?.role || 'Chưa có role';
  };
  

  useEffect(() => {
    console.log(searchTerm);
    const fetchUsers = async () => {
      try {
        const data = {
          keyword: searchTerm,
          page: currentPage - 1,
          size: pageSize
        }
        const response = await getListUserByword(data);
        setUsers(response.data);
        setTotalPages(response.totalPage);
        setTotalUsers(response.totalElements);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu người dùng:", err);
      }
    };
    fetchUsers();
  }, [searchTerm, currentPage])


  const handleView = (user: UserType) => {
    setErrors((prevErrors) => {
      const newErrors: { [key: string]: string } = {};
      Object.keys(prevErrors).forEach((key) => {
        newErrors[key] = "";
      });
      return newErrors;
    });

    setSelectedUser(user);
    setEditMode(false);
    setAddMode(false);
    setVisible(true);
  };

  const handleEdit = (user: UserType) => {
    setErrors((prevErrors) => {
      const newErrors: { [key: string]: string } = {};
      Object.keys(prevErrors).forEach((key) => {
        newErrors[key] = "";
      });
      return newErrors;
    });

    setSelectedUser(user);
    setEditedUser({ ...user });
    setEditMode(true);
    setAddMode(false);
    setVisible(true);
  };

  const handleAdd = () => {
    setErrors((prevErrors) => {
      const newErrors: { [key: string]: string } = {};
      Object.keys(prevErrors).forEach((key) => {
        newErrors[key] = "";
      });
      return newErrors;
    });

    setNewUser({
      userId: users.length + 10,
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      isOnline: false,
      isActive: false,
    });
    setAddMode(true);
    setEditMode(false);
    setVisible(true);
  };

  const handleSave = () => {
    if (editedUser) {
      const updateInfo = async () => {
        try {
          // const validate = await validateUser(editedUser);
          // console.log(validate)
          // console.log(editedUser)
          // if (validate.status == 400) {
          //   showAlert("Có trường không hợp lê", "warning");
          //   setErrors(validate.response.data)
          //   return;
          // }
          const response = await updateUser(editedUser);
          console.log(response)
          if (response.status == 400) {
            showAlert("Có trường không hợp lê", "warning");
            setErrors(response.response.data.data)
            return;
          }

          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.userId === editedUser.userId ? editedUser : user
            )
          );
          setVisible(false);
          setLoading(!loading)
          showAlert("Đã cập nhật thông tin", "success");
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu người dùng:", err);
        }
      };

      updateInfo();
    }
  };

  const handleSaveNewUser = () => {
    if (newUser.userName && newUser.email) {

      let { userId, isOnline, isActive, ...data } = newUser;
      console.log(data)
      const createUser = async () => {
        try {

          // const validate = await validateUser(data);
          // console.log(validate)

          // if (validate.status == 400) {
          //   showAlert("Có trường không hợp lê", "warning");
          //   setErrors(validate.response.data)
          //   return;
          // }

          const response = await addUser(data);
          console.log(response);

          if (response.status == 400) {
            showAlert("Có trường không hợp lê", "warning");
            setErrors(response.response.data.data)
            return;
          }

          setUsers((prevUsers) => [...prevUsers, newUser]);
          setVisible(false);
          setLoading(!loading)
          showAlert("Đã thêm người dùng mới", "success");
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu người dùng:", err);
        }
      };

      createUser();
    }
  };

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    const data = {
      userId: userId,
      isActive: !currentStatus
    }

    const updateUser = async () => {
      try {
        const response = await updateActive(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu người dùng:", err);
      }
    };

    updateUser();

    setUsers(users.map((user) =>
      user.userId === userId ? { ...user, isActive: !currentStatus } : user
    ));
  };

  const editRoleUser = async (userId :  number  , role : string) => {
      const response = await updateUserRole(userId , role);
      console.log("------------ up[ date role user")
      console.log(response);
  }

  const handleChangeRole = (userId: number) => {
    console.log(userId)
    const role = getRoleByUserId(userId)

    if(role == "USER")
      editRoleUser(userId , "ADMIN")
    else if(role == "ADMIN")
      editRoleUser(userId , "USER")
    //  khi nhấn vô role bất kì của user thì  chuyển đổi giữa admin  và user viết thêm code để change role theo id user 
    // nhấn crtl + bấm chuột trái vào tên hàm  để đến nơi  hàm được gọi , sửa lại  code ở đó

    setLoading(!loading);
  }

  return (
    <>
      {alert && <AlertMessage message={alert.message} severity={alert.severity} />}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong className="fs-5">Danh Sách Người Dùng</strong>
              <div className="d-flex align-items-center gap-3">
                <CFormInput
                  type="text"
                  placeholder="🔍 Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "250px" }} // Tăng độ rộng cho ô tìm kiếm
                />
                <CButton color="success" className="px-4" onClick={handleAdd}>
                  + Thêm Người Dùng
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable bordered striped hover responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Họ</CTableHeaderCell>
                    <CTableHeaderCell>Tên</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Trạng Thái</CTableHeaderCell>
                    <CTableHeaderCell>Khoá</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Hành Động</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user) => (
                    
                    <CTableRow key={user.userId}>
                      <CTableDataCell>{user.userId}</CTableDataCell>
                      <CTableDataCell>{user.firstName}</CTableDataCell>
                      <CTableDataCell>{user.lastName}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={user.isOnline ? "success" : "secondary"}>
                          {user.isOnline ? "Online" : "Offline"}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormCheck
                          checked={user.isActive}
                          onChange={() => handleToggleActive(user.userId, user.isActive)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <span
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() => handleChangeRole(user.userId)}
                        >
                          {getRoleByUserId(user.userId)}{/* đang để cố định user , lấy danh sách  role rồi load lại thành động ,  đã có sẵn user.userId */}
                        </span></CTableDataCell>
                      <CTableDataCell>
                        <CButton color="primary" size="sm" onClick={() => handleView(user)} className="me-2">
                          Xem
                        </CButton>
                        <CButton color="warning" size="sm" onClick={() => handleEdit(user)}>
                          Sửa
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>


              {/* Pagination Bar */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Hiển thị {users.length} / {totalUsers} người dùng</span>
                <CPagination align="end">
                  <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Trước
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Sau
                  </CPaginationItem>
                </CPagination>
              </div>

            </CCardBody>
          </CCard>
        </CCol>

        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>
              {editMode ? "Chỉnh Sửa Người Dùng" : addMode ? "Thêm Người Dùng" : "Thông Tin Người Dùng"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedUser && !editMode && !addMode ? (
              // Hiển thị thông tin người dùng khi ở chế độ Xem
              <div>
                <p><strong>ID:</strong> {selectedUser.userId}</p>
                <p><strong>User name:</strong> {selectedUser.userName}</p>
                <p><strong>Họ:</strong> {selectedUser.firstName}</p>
                <p><strong>Tên:</strong> {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Trạng thái:</strong> {selectedUser.isOnline ? "Online" : "Offline"}</p>
                <p><strong>Khoá:</strong> {selectedUser.isActive ? "Hoạt động" : "Bị khoá"}</p>
                <p><strong>Role:</strong>{getRoleByUserId(selectedUser.userId)}</p>
              </div>
            ) : (
              // Form chỉnh sửa hoặc thêm người dùng, hiển thị thông báo lỗi dưới từng trường nếu có
              <CForm>
                {Object.keys(newUser)
                  .filter((key) => key !== "userId")
                  .filter((key) => key !== "isOnline")
                  .filter((key) => key !== "isActive")
                  .filter((key) => (editMode && key === "password" ? false : true))
                  .map((key) => (
                    <div key={key} className="mb-3">
                      <CFormLabel className="fw-bold">{key}</CFormLabel>
                      <CFormInput
                        value={
                          addMode
                            ? newUser[key as keyof UserType]
                            : editedUser?.[key as keyof UserType] || ""
                        }
                        onChange={(e) =>
                          addMode
                            ? setNewUser({ ...newUser, [key]: e.target.value })
                            : setEditedUser({ ...editedUser!, [key]: e.target.value })
                        }
                      />
                      {errors[key] && (
                        <p className="text-danger small mt-1">{errors[key]}</p>
                      )}
                    </div>
                  ))}
              </CForm>
            )}
          </CModalBody>



          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>Đóng</CButton>
            {editMode ? <CButton color="primary" onClick={handleSave}>Lưu</CButton> : null}
            {addMode ? <CButton color="success" onClick={handleSaveNewUser}>Thêm</CButton> : null}
          </CModalFooter>
        </CModal>
      </CRow>
    </>

  );
};

export default User;