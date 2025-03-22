import axios from "axios";

const API_URL_BASE = "http://localhost:9999"

export const getListUser = async (data : {page : number , size : number}) => {
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

export const getListUserByword = async (data : {keyword : string , page : number , size : number}) => {
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
        const response = await axios.post(`http://localhost:9999/api/auth/addNewUser`,data);
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
        const dataSend = {        
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber};
        console.log("Gọi API...");
        console.log(`http://localhost:9999/api/api/users/${data.userId}`);
        const response = await axios.put(`http://localhost:9999/api/api/users/${data.userId}`,dataSend);
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
        console.log("Gọi API...");
        const response = await axios.post(
            `${API_URL_BASE}/api/api/users/active/${data.userId}?isActive=${data.isActive}`
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
            phoneNumber: data.phoneNumber};
        console.log("Gọi API...");
        const response = await axios.post(`${API_URL_BASE}/api/api/users/validate?userId=${data.userId}`,dataSend);
        console.log("Dữ liệu nhận được:", response.data);
        return response.data;
    } catch (error: any) {
        // console.error("❌ Lỗi khi gọi API:", error.message);
        // console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};
