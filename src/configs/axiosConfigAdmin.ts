import axios from "axios";


// Tạo instance axios
const axiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json", // Mặc định dùng JSON, có thể thay đổi tùy yêu cầu
    }
});

// Thêm interceptor cho request
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");

        // Nếu có token, thêm vào header Authorization
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Trả lại config đã sửa
        return config;
    },
    (error) => {
        // Nếu có lỗi trong request, trả lại lỗi
        return Promise.reject(error);
    }
);

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(
    (response) => {
        // Trả lại dữ liệu của response
        return response;
    },
    (error) => {
        // Log lỗi nếu có
        console.error("API Error:", error.response || error.message);
        // Nếu có lỗi response, trả về lỗi
        return Promise.reject(error);
    }
);

export default axiosInstance;