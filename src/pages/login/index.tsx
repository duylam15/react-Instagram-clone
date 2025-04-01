import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { callLogin, callInfoUser } from "../../services/auth";
import { FaFacebook } from "react-icons/fa";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm kiểm tra đầu vào
  const validateInputs = () => {
    let isValid = true;
    let newErrors: { username?: string; password?: string } = {};

    if (!username) {
      newErrors.username = "Vui lòng nhập tên đăng nhập!";
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự!";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống!";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Xử lý nhập liệu - nếu đúng thì xóa lỗi
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  // Xử lý đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra lại thông tin đăng nhập!",
        duration: 5,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await callLogin(username, password);

      if (res?.data) {
        // Lưu token vào localStorage
        const token = res.data.token; // Đảm bảo key 'token' đúng với phản hồi từ backend
        const userId = res.data.userId

        console.log(res)
        if (!token) {
          throw new Error("Không tìm thấy token trong phản hồi");
        }

        localStorage.setItem("token", token); // Lưu token vào localStorage
        localStorage.setItem("userId" , userId)

        console.log("Token saved:", token);

        // Lấy thông tin người dùng với token vừa lưu
        const userInfo = await callInfoUser(token);

        notification.success({
          message: "Đăng nhập thành công!",
          duration: 3,
        });

        console.log("User info:", userInfo.data); // Kiểm tra thông tin người dùng
        navigate("/"); // Chuyển hướng sau khi đăng nhập
      } else {
        throw new Error("Thông tin đăng nhập không hợp lệ");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      notification.error({
        message: "Lỗi hệ thống!",
        description: error.message || "Vui lòng thử lại sau.",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Cột bên trái - Ảnh điện thoại Instagram */}
      <div className="hidden lg:flex w-1/2 justify-center">
        <img src="/images/instagram-mockup.png" alt="Instagram mockup" className="h-[550px]" />
      </div>

      {/* Cột bên phải - Form đăng nhập */}
      <div className="flex flex-col items-center w-[350px] bg-white p-8 rounded-lg shadow-md border border-gray-300">
        {/* Logo Instagram */}
        <div className="flex justify-center mb-6">
          <img src="/images/Instagram-Logo.png" alt="Instagram Logo" className="h-25 w-auto" />
        </div>

        {/* Form Đăng Nhập */}
        <form onSubmit={handleLogin} className="flex flex-col w-full">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={handleUsernameChange}
              className={`p-2 border rounded-md text-sm w-full ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-black`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div className="mb-2">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={handlePasswordChange}
              className={`p-2 border rounded-md text-sm w-full ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-black`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm font-semibold">HOẶC</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Đăng nhập với Facebook */}
        <button
          className="flex btn_facebook items-center justify-center font-semibold p-2 rounded-lg hover:text-blue-800 transition duration-300 bg-transparent"
          style={{ background: "none" }}
        >
          <FaFacebook style={{ fontSize: "20px", color: "rgb(76,181,249)", marginRight: 8 }} />
          Đăng nhập bằng Facebook
        </button>

        <Link to="/forgotpassword" className="text-black-500 text-sm text-center mt-2">
          Quên mật khẩu?
        </Link>

        {/* Đăng ký tài khoản */}
        <div className="border border-gray-300 w-full text-center text-sm mt-5 p-3 rounded-md">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 font-semibold">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;