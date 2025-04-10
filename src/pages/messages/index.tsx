import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import MessageInput from "../../components/CommentInput/MessageInput";

import VideoCall from "../call/VideoCall"
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatAppGemini from "../../components/chatGemini";

import ImageCaptionUploader from '../../components/InstagramPost/ImageCaptionUploader';
const userId = Number(localStorage.getItem("userId"));
// Định nghĩa type Conversation
interface Conversation {
	idConversation: number;
	idUserReceive: number;
	firstNameReceiver: string;
	lastNameReceiver: string;
	firstNameSender: string;
	lastNameSender: string;
	img: string; // Ảnh đại diện
	listMessageDTO: Message[];
}
interface Message {
	idSender: number;
	messageStatus: string;
	readAt: string | null;
	typeMessage: string;
	content: string;
}

const Messages = () => {
	const { t } = useTranslation();
	// Đặt kiểu dữ liệu cho state
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const token = localStorage.getItem("token");
	useEffect(() => {
		console.log("đang vô set user receive id");
		if (selectedChat) {
			console.log(selectedChat);
		  const chat = conversations.find((c) => c.idConversation === selectedChat.idConversation);
		  if (chat) {
			localStorage.setItem("userReceiveId", `${selectedChat.idUserReceive}`);
		  }
		}
	  }, [selectedChat, conversations]);
	useEffect(() => {
		const socket = new SockJS("http://localhost:9999/api/ws");
		const stompClient = Stomp.over(socket);
		stompClient.connect(
			{Authorization: `Bearer ${token}`},
			() => {
				console.log("Connected to WebSocket Server");

				const subscription = stompClient.subscribe(
					`/topic/conversation/${selectedChat?.idConversation}`,
					(message) => {
						console.log("Received:", message.body);
						const newMessage = JSON.parse(message.body);
						setMessages((prevMessages) => [...prevMessages, newMessage]);
					}
				);

				return () => {
					subscription.unsubscribe();
				};
			},
			(error : unknown) => {
				console.error("Connection error:", error);
			}
		);

		stompClient.activate();

		return () => {
			stompClient.deactivate();
		};
	}, [selectedChat]);
	// Lấy danh sách conversation của user
	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const response = await axios.get(`http://localhost:9999/api/messages/getAllConversation/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`, // Thêm token vào header
					},
				});
				console.log(response)
				setConversations(response.data.data || []);
			} catch (error) {
				console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
			}
		};
		fetchConversations();
	}, []);

	const handleSelectChat = async (chat: Conversation) => {
		setSelectedChat(chat); // ✅ Set full conversation object
		console.log(chat)

		try {
			const response = await axios.get(`http://localhost:9999/api/messages/1/${chat.idConversation}`, {
				headers: {
					Authorization: `Bearer ${token}`, // Thêm token vào header
				},
			});
			setMessages(Array.isArray(response.data.data.listMessageDTO) ? response.data.data.listMessageDTO : []);
		} catch (error) {
			console.error("Lỗi khi lấy tin nhắn:", error);
		}
	};


	console.log("messages", messages)

	return (
		<div className="flex w-[92%] h-[100vh] ml-20" style={{ borderColor: "var(--white-to-gray)" }}>
			{/* Sidebar danh sách chat */}
			<div className="w-[550px] border-r overflow-y-auto" style={{ borderColor: "var(--white-to-gray)" }}>
				<h2 className="p-4 pt-6 text-2xl font-bold">Username</h2>
				<h2 className="p-4 pt-6 font-bold">{t("messages")}</h2>
				{conversations.length === 0 ? (
					<p className="p-4 text-gray-500">Không có cuộc trò chuyện nào.</p>
				) : (
					conversations.map((chat) => (
						<div
							key={chat.idConversation}
							className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${selectedChat?.idConversation === chat.idConversation ? "bg-gray-300" : ""}`}
							style={{
								color: "var(--text-color)",
								borderColor: "var(--white-to-gray)",
							}}
							onClick={() => handleSelectChat(chat)}
						>
							<img src={chat.img || "/default-avatar.png"} alt="Avatar" className="w-12 h-12 rounded-full mr-3" />
							<div>
								<p className="font-normal" style={{ color: "var(--text-color)" }}>
									{chat.firstNameReceiver} {chat.lastNameReceiver}
								</p>
								<p className="text-sm text-gray-500">
									{chat.listMessageDTO && chat.listMessageDTO.length > 0 ? chat.listMessageDTO[0]?.content : "Chưa có tin nhắn"}
								</p>
							</div>
						</div>
					))
				)}
			</div>

			{/* Khung chat bên phải */}
			<div className="w-[100%] flex flex-col">
				{selectedChat ? (
					<div className="flex flex-col h-full">
						{/* Header khung chat */}
						<div className="p-4 border-b flex items-center" style={{ borderColor: "var(--white-to-gray)" }}>
							<img
								src={
									conversations.find((chat) => chat.idConversation === selectedChat?.idConversation)?.img ||
									"/default-avatar.png"
								}
								alt="Avatar"
								className="w-10 h-10 rounded-full mr-3"
							/>
							<p className="font-semibold">
								{conversations.find((chat) => chat.idConversation === selectedChat?.idConversation)?.firstNameReceiver}{" "}
								{conversations.find((chat) => chat.idConversation === selectedChat?.idConversation)?.lastNameReceiver}
							</p>
						</div>

						{/* Nội dung tin nhắn */}
						<div className="flex-1 overflow-y-auto p-4">
							{messages.length === 0 ? (
								<p className="text-center text-gray-500">Chưa có tin nhắn nào.</p>
							) : (
								messages.map((msg, index) => (
									<p
										key={index}
										className={`p-2 pl-4 rounded-3xl max-w-xs mb-2 ${msg.idSender === userId ? "ml-auto bg-blue-400 text-white" : "bg-gray-200"}`}
										style={{
											color: msg.idSender === userId ? "white" : "var(--text-color)",
											background: msg.idSender === userId ? "var(--message-bg-color)" : "gray",
											borderColor: "var(--white-to-gray)",
										}}
									>
										{msg.content}
									</p>
								))
							)}
						</div>

						{/* Input gửi tin nhắn */}
						<div className="flex items-center rounded-full px-4 focus:outline-none ml-4 mr-4 mb-4 border" style={{ borderColor: "var(--white-to-gray)" }}>
							<MessageInput
								conversationId={selectedChat.idConversation}
								senderId={userId}
								onMessageSent={(newMessage) => setMessages([...messages, newMessage])}
							/>
						</div>
						<div className="flex justify-end p-4">
							<VideoCall />
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-full text-gray-500">
						Chọn một cuộc trò chuyện để bắt đầu nhắn tin
					</div>
				)}
			</div>
			{/* <ChatAppGemini /> */}
			{/* <ImageCaptionUploader /> */}
		</div>

	);
};

export default Messages;
