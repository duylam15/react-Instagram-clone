import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Button, Modal, message as antdMessage } from "antd";
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const VideoCall: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [kitToken, setKitToken] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [roomID, setRoomID] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [receiverID, setReceiverID] = useState<string | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const token = localStorage.getItem("token");
  const getUrlParams = (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const storedUserID = localStorage.getItem("userId");
    const generatedUserID = storedUserID || Math.floor(Math.random() * 10000).toString();

    if (!storedUserID) {
      localStorage.setItem("userId", generatedUserID);
    }

    // const generatedRoomID = getUrlParams("roomID") || Math.floor(Math.random() * 10000).toString();

    const generatedUserName = getUrlParams("username") || `userName${generatedUserID}`;
    const storedUserReceiveID = localStorage.getItem("userReceiveId");
    const generatedReceiverID = storedUserReceiveID || "2";

    if (!storedUserReceiveID) {
      localStorage.setItem("userId", generatedReceiverID);
    }
    // const generatedRoomID = `${generatedReceiverID}${generatedUserID}`;
    const generatedRoomID = "1234";
    setRoomID(generatedRoomID);
    setUserID(generatedUserID);
    setUserName(generatedUserName);
    setReceiverID(generatedReceiverID);

    const socket = new SockJS("http://localhost:9999/api/ws");
    const client = Stomp.over(socket);

    client.connect({ Authorization: `Bearer ${token}` },
      () => {
        console.log("✅ Kết nối WebSocket thành công!");
        setStompClient(client);
      });

    client.onDisconnect = () => {
      console.log("🔴 WebSocket đã ngắt kết nối.");
      setStompClient(null);
    };

    client.activate();

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    if (!roomID || !userID || !userName) return;

    const appID = 1166743846;
    const serverSecret = "e42953fb46e3d9c91b3ad35d65721232";
    console.log("akjfnijccfknasfian: " + roomID)
    console.log(typeof roomID, roomID);
    const testToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      "1234", // Dùng roomID mới nhất
      userID,
      userName
    );

    setKitToken(testToken);
  }, [roomID, userID, userName]);

  useEffect(() => {
    if (!kitToken || !isOpen) return;

    if (rootRef.current) {
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: rootRef.current,
        scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
        showUserList: true,
        showTextChat: true,
        showScreenSharingButton: true,
      });
    }
  }, [kitToken, isOpen]);

  const handleSubscribe = () => {
    if (!stompClient || !userID) {
      antdMessage.error("❌ WebSocket chưa kết nối hoặc thiếu userID!");
      return;
    }

    stompClient.subscribe(`/queue/call/${userID}`, (stompMessage) => {
      try {
        const callData = JSON.parse(stompMessage.body);
        console.log("📩 Nhận cuộc gọi:", callData);

        if (callData.status === "accept") {
          setRoomID(callData.roomId); // Gán room ID từ cuộc gọi
          setIsOpen(true);
        } else if (callData.callerName) {
          antdMessage.info(`📞 ${callData.callerName} đang gọi cho bạn!`);

          const acceptCall = window.confirm(`📞 ${callData.callerName} đang gọi. Chấp nhận?`);

          if (acceptCall) {
            setRoomID(callData.roomId); // Gán room ID từ cuộc gọi
            setIsOpen(true);

            // Gửi phản hồi chấp nhận cuộc gọi
            stompClient.publish({
              destination: `/queue/call/${callData.callerId}`,
              body: JSON.stringify({ status: "accept", roomId: callData.roomId }),
            });
          }
        }
      } catch (error) {
        console.error("❌ Lỗi khi xử lý tin nhắn WebSocket:", error);
      }
    });

    setIsSubscribed(true);
    antdMessage.success("✅ Đăng ký WebSocket thành công!");
  };

  const handleCall = () => {
    if (!receiverID || !stompClient) {
      antdMessage.error("❌ Vui lòng cung cấp ID người nhận và kết nối WebSocket.");
      return;
    }

    const callData = {
      callerId: userID,
      callerName: userName,
      roomId: roomID,
      receiverId: receiverID,
    };

    stompClient.publish({
      destination: `/app/call/${receiverID}`,
      body: JSON.stringify(callData),
    });

    antdMessage.success(`📤 Đã gửi yêu cầu gọi tới ID: ${receiverID}`);
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <Button type="default" onClick={handleSubscribe} disabled={isSubscribed}>
        {isSubscribed ? "✅ Đã đăng ký WebSocket" : "📡 Đăng ký WebSocket"}
      </Button>

      <Button type="primary" onClick={handleCall} disabled={!isSubscribed}>
        📞 Bắt đầu Video Call
      </Button>

      <Modal
        title="Cuộc gọi video"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={900}
      >
        <div ref={rootRef} style={{ width: "100%", height: "70vh" }} />
      </Modal>
    </div>
  );
};

export default VideoCall;
