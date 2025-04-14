import axios from "axios";

const API_URL_BASE = "http://localhost:9999"

export const getListUser = async (data: { page: number, size: number }) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `${API_URL_BASE}/api/api/users/getdsusers?page=${data.page}&size=${data.size}`
        );
        console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const getListUserByword = async (data: { keyword: string, page: number, size: number }) => {
    try {
        console.log("Gọi API...");
        const response = await axios.get(
            `${API_URL_BASE}/api/api/users/getdsusersbykeyword?keyword=${data.keyword}&page=${data.page}&size=${data.size}`
        );
        console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const addUser = async (data: any) => {
    try {
        console.log("Gọi API...");
        const response = await axios.post(`http://localhost:9999/api/auth/addNewUser`, data);
        // console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        // console.error("❌ Lỗi khi gọi API:", error.message);
        // console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};


export const updateUser = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        const dataSend = {
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber
        };
        console.log("Gọi API...");
        console.log(`http://localhost:9999/api/api/users/${data.userId}`);
        const response = await axios.put(`http://localhost:9999/api/api/users/${data.userId}`, dataSend,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        // console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        // console.error("❌ Lỗi khi gọi API:", error.message);
        // console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};


export const updateActive = async (data: any) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        const response = await axios.post(
            `${API_URL_BASE}/api/api/users/active/${data.userId}?isActive=${data.isActive}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const validateUser = async (data: any) => {
    try {
        console.log(data.userId)
        const dataSend = {
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber
        };
        console.log("Gọi API...");
        const response = await axios.post(`${API_URL_BASE}/api/api/users/validate?userId=${data.userId}`, dataSend);
        console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        // console.error("❌ Lỗi khi gọi API:", error.message);
        // console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};

export const getUserProfile = async (data: { idUser: number }) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL_BASE}/api/api/users/${data.idUser}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};


export const getUserById = async (id: any) => {
    try {
        const userId: any = localStorage.getItem('userId');
        const token: any = localStorage.getItem('token');
        const response = await axios.get(`${API_URL_BASE}/api/api/users/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            });
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const getListUserNoPage = async (token: any) => {
    try {
        const response = await axios.get(`${API_URL_BASE}/api/api/users/getdsusers`, {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const getUserRole = async (userId: number) => {
    try {
        const token: any = localStorage.getItem('token');
        const response = await axios.get(`${API_URL_BASE}/api/api/users/roles/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const updateUserRole = async (userId: number, role: string) => {
    try {
        const token: any = localStorage.getItem('token');
        const data = [role]
        const response = await axios.put(`${API_URL_BASE}/api/api/users/roles/${userId}`,data,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            });
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};
