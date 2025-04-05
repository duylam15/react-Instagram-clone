import { useEffect, useState } from 'react';
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    username: string;
    isOnline: boolean;
}

const OnlineBox = () => {
    const [users, setUsers] = useState<User[]>([]);
    const token = localStorage.getItem("token");
    
    useEffect(() => {
        if (!token) return;

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.sub;
        const username = decodedToken.sub;
        
        const currentUser: User = {
            id: userId,
            username: username,
            isOnline: true,
        };

        const socket = new SockJS("http://localhost:9999/api/ws");
        const stompClient = Stomp.over(socket);  
        let subscription: any;

        // Chỉ gửi thông báo online một lần khi kết nối
        const sendOnlineStatus = (status: boolean) => {
            const userStatus = { ...currentUser, isOnline: status };
            stompClient.send(
                "/topic/online",
                {},
                JSON.stringify(userStatus)
            );
        };

        stompClient.connect(
            { Authorization: `Bearer ${token}` },
            () => {
                console.log("Connected to WebSocket Server");
                
                // Gửi trạng thái online khi kết nối
                sendOnlineStatus(true);

                subscription = stompClient.subscribe(
                    `/topic/online`,
                    (message) => {
                        try {
                            const receivedData: User = JSON.parse(message.body);
                            
                            setUsers((prevUsers) => {
                                // Loại bỏ user cũ nếu đã tồn tại
                                const filteredUsers = prevUsers.filter(
                                    (u) => u.id !== receivedData.id
                                );
                                
                                // Nếu user offline thì không thêm lại
                                if (!receivedData.isOnline) {
                                    return filteredUsers;
                                }
                                
                                // Thêm user mới nếu online
                                return [
                                    ...filteredUsers,
                                    {
                                        id: receivedData.id,
                                        username: receivedData.username,
                                        isOnline: receivedData.isOnline,
                                    },
                                ];
                            });
                        } catch (e) {
                            console.error("Error parsing received message:", e);
                        }
                    }
                );
            },
            (error: unknown) => {
                console.error("Connection error:", error);
            }
        );

        // Xử lý khi component unmount hoặc user offline
        const handleDisconnect = () => {
            if (stompClient.connected) {
                sendOnlineStatus(false); // Gửi trạng thái offline trước khi ngắt kết nối
                if (subscription) {
                    subscription.unsubscribe();
                }
                stompClient.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };

        // Thêm event listener cho việc đóng tab/trình duyệt
        window.addEventListener('beforeunload', handleDisconnect);

        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleDisconnect);
            handleDisconnect();
        };
    }, [token]);

    return (
        <div className="p-4">
            <p className="text-base font-bold mb-4">Đang hoạt động</p>
            <ul className="space-y-2">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} className="flex items-center space-x-2">
                            <span
                                className={`h-3 w-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                            />
                            <span>{user.username}</span>
                        </li>
                    ))
                ) : (
                    <li>No users available</li>
                )}
            </ul>
        </div>
    );
};

export default OnlineBox;