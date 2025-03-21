import axios from "axios";

// Định nghĩa kiểu dữ liệu cho data
interface RegisterData {
    email: string;
    fullName: string;
    userName: string;
    password: string;
}

const API_URL = "http://localhost:9999/api"

export const callRegister = async (data: RegisterData) => {
    try {
        // Tách fullname thành firstName và lastName (nếu muốn)
        const [firstName, ...lastNameParts] = data.fullName.trim().split(" ");
        const lastName = lastNameParts.join(" ") || ""; // Nếu không có lastName thì để trống

        const response = await axios.post(`${API_URL}/auth/addNewUser`, {
            email: data.email,
            userName: data.userName,
            password: data.password,
            firstName: firstName, // Gửi firstName từ fullName
            lastName: lastName,   // Gửi lastName (nếu có)
            // Các trường khác như isActive, isOnline sẽ do backend mặc định
        });
        return response; // Trả về response để xử lý trong component
    } catch (error) {
        throw error; // Ném lỗi để xử lý trong component
    }
};

export const callLogin = (username, password) => {
    return axios.post(`${API_URL}/auth/generateToken`, { username, password });
};

export const callInfoUser = (token) => {
    return axios.get(`${API_URL}/auth/user/userProfile`, {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
        },
    });
};
