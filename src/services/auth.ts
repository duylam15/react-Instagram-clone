import axios from "axios";

// Định nghĩa kiểu dữ liệu cho data
interface RegisterData {
  email: string;
  fullname: string;
  username: string;
  password: string;
}

export const callRegister = async (data:RegisterData) => {
  return axios.post("/api/auth/register", {
    email: data.email,
    fullName: data.fullname,
    username: data.username,
    password: data.password,
  });
};


export const callLogin = (username, password) => {
	return axios.post('/auth/login', { username, password });
}

export const callInfoUser = (token) => {
	return axios.get('/taikhoan/me', {
		headers: {
			Authorization: `Bearer ${token}` // Thêm token vào header
		}
	});
}