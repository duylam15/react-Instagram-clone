import { useState } from "react";
import { Link } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Vui lòng nhập email hoặc tên người dùng.");
      return;
    }
    // Giả lập API gửi email đặt lại mật khẩu
    setMessage("Nếu tài khoản tồn tại, bạn sẽ nhận được email đặt lại mật khẩu.");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 w-96 border border-gray-300 rounded-t-lg text-center">
        {/* Instagram Logo */}
        <img
          src="../../../public/images/lock.png"
          alt="Instagram"
          className="w-50 mx-auto mb-6"
        />

        <h2 className="text-lg text-gray-700 font-medium mb-2">Gặp vấn đề khi đăng nhập?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Nhập email, số điện thoại hoặc tên người dùng và chúng tôi sẽ gửi cho bạn liên kết để lấy lại mật khẩu.
        </p>

        {/* Form nhập email */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
            placeholder="Email, số điện thoại hoặc tên người dùng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={!email} 
            className={`w-full p-1 rounded-lg font-semibold transition duration-300 ${
              email ? "!bg-blue-700 text-white" : "!bg-gray-300 text-gray-500 !cursor-not-allowed"
            }`}
            style={{ marginTop: 0 }}
          >
            Gửi liên kết đăng nhập
          </button>

        </form>

        {/* Hiển thị thông báo */}
        <div className="flex items-center my-3 mt-7">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm font-semibold">HOẶC</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

        {/* Hoặc đăng nhập bằng Facebook */}
        <div className=" my-3 ">
        <Link to="/register" className="text-blue-500 text-sm font-medium hover:underline">
            Tạo tài khoản mới
          </Link>
        </div>
  
      </div>

      {/* Quay lại đăng nhập */}
      <div className="border border-gray-300 w-96 text-center text-sm p-3 rounded-b-lg">
          <Link to="/login" className="text-blue-500 text-sm font-medium hover:underline">
            Quay lại trang đăng nhập
          </Link>
        </div>
    </div>
  );
}
