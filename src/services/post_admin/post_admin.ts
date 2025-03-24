import axios from "axios";

const API_URL_BASE = "http://localhost:9999"

export const getListPost = async (data : {page : number , size : number}) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `${API_URL_BASE}/api/posts?page=${data.page}&size=${data.size}`
        );
        console.log("Dữ liệu nhận được list post:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};
