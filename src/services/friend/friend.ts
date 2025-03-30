import axios from "axios";

const API_URL_BASE = "http://localhost:9999"

export const guiLoiMoiKetBan = async (data : {sender : number , receiver : number , status : string}) => {
    try {
        console.log("Gọi API... gui loi moi ket ban");
        console.log(data)
        const response = await axios.post(
            `${API_URL_BASE}/api/listinvitedfriend`,
            data 
        );
        console.log("Dữ liệu nhận được:", response.data);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};


export const checkFriend = async (data : { idUser1  :number, idUser2 : number }) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/friend/isFriend?userId=${data.idUser1}&friendId=${data.idUser2}`
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};

export const checkSent = async (data : { idUser1  :number, idUser2 : number }) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/listinvitedfriend/isSent?senderId=${data.idUser1}&receiverId=${data.idUser2}`
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};

export const createInvite = async (data : { idSender  :number, idReceiver : number , status : string }) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const dataSend = {
            sender : data.idSender,
            receiver : data.idReceiver , 
            status :  data.status
        }
        const response = await axios.post(
            `http://localhost:9999/api/listinvitedfriend`,
            dataSend
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};


export const updateInvite = async (data : { idSender  :number, idReceiver : number , status : string }) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const dataSend = {status : data.status}
        const response = await axios.put(
            `http://localhost:9999/api/listinvitedfriend/update?senderId=${data.idSender}&receiverId=${data.idReceiver}`,
            dataSend
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};

export const deleteFriend = async (data : { idUser :number, idFriend : number  }) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.delete(
            `http://localhost:9999/api/friend/deleteFriend?userId=${data.idUser}&friendId=${data.idFriend}`
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};

export const getListFriends = async (data : { idProfile  :number}) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/friend/getlistfriends/${data.idProfile}`
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};

export const getListInviteReceived = async (data : { idProfile  :number}) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/listinvitedfriend/received/${data.idProfile}`
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};

export const getListInviteSent = async (data : { idProfile  :number}) => {
    try {
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/listinvitedfriend/sended/${data.idProfile}`
        );
        console.log("Dữ liệu nhận được:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API:", error.message);
        console.error("🛠 Chi tiết lỗi:", error);
        return error;
    }
};