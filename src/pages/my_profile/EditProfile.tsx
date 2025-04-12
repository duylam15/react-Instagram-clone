import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './edit.scss';
import axios from 'axios'; // Đảm bảo axios được import đúng
import { message } from 'antd';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Nhận userId từ URL params
  const [user, setUser] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',

  });


  const [errors, setErrors] = useState<{
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;

  }>({});


  useEffect(() => {

    loadUser(1);

  }, []);

  const loadUser = async (userId: any) => {
    try {
      const idDangNhap = Number(localStorage.getItem("userId"))
      const token = localStorage.getItem('token');
      const result = await axios.get(`http://localhost:9999/api/api/users/${idDangNhap}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      if (result.status === 200) {
        setUser(result.data.data); // Cập nhật thông tin người dùng vào state
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateField = (name: any, value: any) => {
    let errorMessage = '';

    // Kiểm tra userName
    if (name === 'userName') {
      if (!value.trim()) {
        errorMessage = 'UserName is required';
      } else if (value.length < 3 || value.length > 50) {
        errorMessage = 'UserName must be between 3 and 50 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        errorMessage = 'Username can only contain letters, numbers, and underscores';
      }
    }

    // Kiểm tra firstName
    else if (name === 'firstName') {
      if (!value.trim()) {
        errorMessage = 'Firstname is required';
      } else if (value.length < 2 || value.length > 50) {
        errorMessage = 'Firstname must be between 2 and 50 characters';
      } else if (!/^[a-zA-ZÀ-ỹ\\s]+$/.test(value)) {
        errorMessage = 'Firstname must contain only letters';
      }
    }

    // Kiểm tra lastName
    else if (name === 'lastName') {
      if (!value.trim()) {
        errorMessage = 'Lastname is required';
      } else if (value.length < 2 || value.length > 50) {
        errorMessage = 'Lastname must be between 2 and 50 characters';
      } else if (!/^[a-zA-ZÀ-ỹ\\s]+$/.test(value)) {
        errorMessage = 'Lastname must contain only letters';
      }
    }

    // Kiểm tra email
    else if (name === 'email') {
      if (!value.trim()) {
        errorMessage = 'Email is required';
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        errorMessage = 'Invalid email format';
      }
    }

    // Kiểm tra phoneNumber
    else if (name === 'phoneNumber') {
      if (!value.trim()) {
        errorMessage = 'PhoneNumber is required';
      } else if (!/^[0-9]{10}$/.test(value)) {
        errorMessage = 'Phone number must be 10 digits';
      }
    }



    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };


  const handleSave = async (e: any) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      return;
    }

    try {
      const idDangNhap = Number(localStorage.getItem("userId"))
      const token = localStorage.getItem('token');
      const result = await axios.put(`http://localhost:9999/api/api/users/${idDangNhap}`, user,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      message.success('Cập nhật thông tin cá nhân thành công');
      console.error(result.status);
      navigate('/profile');
      if (result.status === 200) {

        navigate('/profile');
      } else {
        message.error('Cập nhật thông tin không thành công');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  return (

    <div className='container'>
      <h3 style={{ marginTop: '30px' }}>Chỉnh sửa thông tin cá nhân</h3>
      <div className='form-container'>
        <form onSubmit={handleSave}>
          <div >
            <label htmlFor='userName' style={{ marginTop: '13vh' }}>Tên đăng nhập</label>
            <input
              type='text'
              id='userName'
              name='userName'
              value={user.userName}
              onChange={handleChange}
              required
            />
            {errors.userName && <span className='error-message'>{errors.userName}</span>}
          </div>
          <div>
            <label htmlFor='firstName'>Họ</label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={user.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && <span className='error-message'>{errors.firstName}</span>}
          </div>
          <div>
            <label htmlFor='lastName'>Tên</label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={user.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastName && <span className='error-message'>{errors.lastName}</span>}
          </div>
          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={user.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className='error-message'>{errors.email}</span>}
          </div>
          <div>
            <label htmlFor='phoneNumber'>Số điện thoại</label>
            <input
              type='number'
              id='phoneNumber'
              name='phoneNumber'
              value={user.phoneNumber}
              onChange={handleChange}
              required
            />
            {errors.phoneNumber && <span className='error-message'>{errors.phoneNumber}</span>}
          </div>

          <div className='button-container'>
            <button type='submit' className='btn btn-save'>
              Cập nhật
            </button>
            <Link to='/profile' className='btn btn-cancel'>
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>

  );
};

export default EditProfile;
