import axios from '../configs/axiosConfigAdmin'


const API_URL_BASE = "http://localhost:9999"

export const getListNotifyByIdReceiver = async (page : number , size : number, idUser: number ) => {
    try {
        const response = await axios.get(
            `${API_URL_BASE}/api/notifies/receiver/${idUser}?page=${page}&size=${size}`
        );
        console.log("Dữ liệu nhận được list post:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const getListNotifyUnReadByIdReceiver = async (page : number , size : number, idUser: number ) => {
    try {
        const response = await axios.get(
            `${API_URL_BASE}/api/notifies/receiver/${idUser}?page=${page}&size=${size}&hasUnRead=true`
        );
        console.log("Dữ liệu nhận được list post:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};

export const markReadNotifyByIdNotify = async (idNotify: number ) => {
    try {
        const response = await axios.put(
            `${API_URL_BASE}/api/notifies/${idNotify}`
        );
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};