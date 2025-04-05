import axios from "axios";

const API_URL_BASE = "http://localhost:9999"

export const guiLoiMoiKetBan = async (data : {sender : number , receiver : number , status : string}) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API... gui loi moi ket ban");
        console.log(data)
        const response = await axios.post(
            `${API_URL_BASE}/api/listinvitedfriend`,
            data ,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được guiLoiMoiKetBan:", response.data);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API guiLoiMoiKetBan:", error.message);
        console.error("🛠 Chi tiết lỗi guiLoiMoiKetBan:", error);
        return error;
    }
};


export const checkFriend = async (data : { idUser1  :number, idUser2 : number }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/friend/isFriend?userId=${data.idUser1}&friendId=${data.idUser2}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được checkFriend:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API checkFriend:", error.message);
        console.error("🛠 Chi tiết lỗi checkFriend:", error);
        return error;
    }
};

export const checkSent = async (data : { idUser1  :number, idUser2 : number }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/listinvitedfriend/isSent?senderId=${data.idUser1}&receiverId=${data.idUser2}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được checkSent:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API checkSent:", error.message);
        console.error("🛠 Chi tiết lỗi checkSent:", error);
        return error;
    }
};

export const createInvite = async (data : { idSender  :number, idReceiver : number , status : string }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const dataSend = {
            sender : data.idSender,
            receiver : data.idReceiver , 
            status :  data.status
        }
        const response = await axios.post(
            `http://localhost:9999/api/listinvitedfriend`,
            dataSend,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được createInvite:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API createInvite:", error.message);
        console.error("🛠 Chi tiết lỗi createInvite:", error);
        return error;
    }
};


export const updateInvite = async (data : { idSender  :number, idReceiver : number , status : string }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const dataSend = {status : data.status}
        const response = await axios.put(
            `http://localhost:9999/api/listinvitedfriend/update?senderId=${data.idSender}&receiverId=${data.idReceiver}`,
            dataSend,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được updateInvite:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API updateInvite:", error.message);
        console.error("🛠 Chi tiết lỗi updateInvite:", error);
        return error;
    }
};

export const deleteFriend = async (data : { idUser :number, idFriend : number  }) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.delete(
            `http://localhost:9999/api/friend/deleteFriend?userId=${data.idUser}&friendId=${data.idFriend}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được deleteFriend:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API deleteFriend:", error.message);
        console.error("🛠 Chi tiết lỗi deleteFriend:", error);
        return error;
    }
};

export const getListFriends = async (data : { idProfile  :number},token:any) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/friend/getlistfriends/${data.idProfile}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được getListFriends:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API getListFriends:", error.message);
        console.error("🛠 Chi tiết lỗi getListFriends:", error);
        return error;
    }
};

// danh sách người nhận kb của idnguoidung
export const getListInviteReceived = async (data : { idProfile  :number}) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/listinvitedfriend/received/${data.idProfile}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được getListInviteReceived:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API getListInviteReceived:", error.message);
        console.error("🛠 Chi tiết lỗi getListInviteReceived:", error);
        return error;
    }
};

// danh sách người dùng gửi lời mời
export const getListInviteSent = async (data : { idProfile  :number}) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Gọi API...");
        console.log(data)
        const response = await axios.get(
            `http://localhost:9999/api/listinvitedfriend/sended/${data.idProfile}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            }
        );
        console.log("Dữ liệu nhận được getListInviteReceived:", response);
        return response;
    } catch (error: any) {
        console.error("❌ Lỗi khi gọi API getListInviteReceived:", error.message);
        console.error("🛠 Chi tiết lỗi getListInviteReceived:", error);
        return error;
    }
};