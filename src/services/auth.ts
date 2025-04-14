import axios from "axios";

// Định nghĩa kiểu dữ liệu cho data
interface RegisterData {
    email: string;
    firstName: string;
    lastName:string;
    userName: string;
    password: string;
}

const API_BACKEND = "http://localhost:9999/api/";

export const callRegister = async (data: RegisterData) => {
    return axios.post(` http://localhost:9999/api/auth/addNewUser`, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        password: data.password,
    });
};

export const callLogin = (username:any, password:any) => {
    return axios.post(`${API_BACKEND}auth/generateToken`, { username, password });
};

export const callInfoUser = (token:any) => {
    return axios.get(`${API_BACKEND}auth/user/userProfile`, {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
        },
    });
};

export const callInforAdmin = (token : any) => {
    return axios.get(`${API_BACKEND}auth/admin/adminProfile`, {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
        },
    });
}

export const callUserProfile = (id:any, token:any) => {
    console.log("token call", token);
    console.log("id call", id);
     return axios.get(`http://localhost:9999/api/api/users/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
        },
    });
};

