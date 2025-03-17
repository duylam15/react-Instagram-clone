import axios from "axios";

export const fetchMessages = async () => {
    try {
        console.log("Gọi API...");
        const response = await axios.get(
            "http://localhost:9999/api/messages/1/1"
        );
        console.log("Dữ liệu nhận được:", response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return null;
    }
};
