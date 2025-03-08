import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, notification } from 'antd';
import { callRegister } from "../../services/auth";
import { FacebookOutlined } from "@ant-design/icons";
import './register.css'

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<FormValuesType>({
    email: '',
    fullname: '',
    username: '',
    password: '',
  });

  // Định nghĩa kiểu dữ liệu cho formValues
type FormValuesType = {
  email: string;
  fullname: string;
  username: string;
  password: string;
};

// Định nghĩa kiểu dữ liệu cho errors
type ErrorType = {
  [key: string]: string;
};


const [errors, setErrors] = useState<ErrorType>({});


 
  const navigate = useNavigate();

  // Xử lý thay đổi dữ liệu & xóa lỗi khi nhập lại
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" }); // Xóa lỗi khi nhập lại đúng
    }
  };

  const validateForm = () => {
    let newErrors: ErrorType = {};

    if (!formValues.email || !/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email không hợp lệ!";
    }
    if (!formValues.fullname.trim()) {
      newErrors.fullname= "Họ và tên không được để trống!";
    }
    if (!formValues.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống!";
    }
    if (!formValues.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Nếu có lỗi, dừng lại

    setIsSubmitting(true);
    try {
      const res = await callRegister(formValues);
      setIsSubmitting(false);

      if (res.data.statusCode === 200) {
        notification.success({ message: "Đăng ký tài khoản thành công!" });
        navigate('/login');
      } else {
        notification.error({
          message: res?.data.message || "Đăng ký thất bại",
          description: Array.isArray(res?.data.message) ? res.data.message[0] : res.data.message,
          duration: 5,
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      notification.error({
        message: "Lỗi hệ thống!",
        description: "Vui lòng thử lại sau.",
        duration: 5,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      

      <div className="flex flex-col items-center w-[350px] bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-center mb-3">
          <img src="/images/Instagram-Logo.png" alt="Instagram Logo" className="h-25 w-auto" />
        </div>

        <p className="text-center text-gray-700 text-base font-medium mb-3">
          Đăng ký để xem ảnh và video từ bạn bè.
        </p>

        <button className="flex button_facebook items-center justify-center bg-blue-700 text-white font-semibold p-2 rounded-lg w-full hover:bg-blue-800 transition duration-300 "
          style={{ paddingTop: 5, paddingBottom: 5}}>
            <FacebookOutlined style={{ fontSize: "20px", color: "#fff", marginRight: 10 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          Đăng ký bằng Facebook
        </button>

        <div className="flex items-center my-3 w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm font-semibold">HOẶC</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col w-full">
          
          <div className="mb-2">
            <input
              type="text"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
              className={`p-2 border rounded-md text-sm w-full ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-black`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>


          <div className="mb-2">
            <input
              name="hoTen"
              value={formValues.fullname}
              onChange={handleChange}
              placeholder="Tên đầy đủ"
              className={`p-2 border rounded-md text-sm w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-black`}
            />
            {errors.fullname&& <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
          </div>
          

          <div className="mb-2">
            <input
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="Tên người dùng"
              className={`p-2 border rounded-md text-sm w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-black`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          
          <div className="mb-2">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={formValues.password}
              onChange={handleChange}
              className={`p-2 border rounded-md text-sm w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-black`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <Button type="primary" onClick={handleSubmit} loading={isSubmitting} className="button-submit">
            Đăng ký
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-2">
          Bằng cách đăng ký, bạn đồng ý với <Link to="#" className="text-blue-500">Điều khoản</Link>, <Link to="#" className="text-blue-500">Chính sách quyền riêng tư</Link> và <Link to="#" className="text-blue-500">Chính sách cookie</Link> của chúng tôi.
        </p>

        <p className="text-center text-sm mt-5">
          Bạn đã có tài khoản? <Link to="/login" className="text-blue-500 font-semibold">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
