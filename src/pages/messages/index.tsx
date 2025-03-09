import React, { useState } from "react";
import CommentInput from "../../components/CommentInput/CommentInput";
import { useTranslation } from "react-i18next";

export default function Messages() {
	const [selectedChat, setSelectedChat] = useState<number | null>(null);

	const conversations = [
		{ id: 1, name: "John Doe", message: "Hey! How are you?", img: "https://i.pravatar.cc/150?img=1" },
		{ id: 2, name: "Jane Smith", message: "Let's meet tomorrow", img: "https://i.pravatar.cc/150?img=2" },
		{ id: 3, name: "Alex Brown", message: "Check out this pic!", img: "https://i.pravatar.cc/150?img=3" },
	];

	const { t } = useTranslation();


	return (
		<div className="flex w-[100%] h-[100vh]" style={{ borderColor: "var(--white-to-gray)" }}>
			{/* Sidebar danh sách chat */}
			<div className="w-[550px] border-r" style={{ borderColor: "var(--white-to-gray)" }}>
				<h2 className="p-4 pt-6 text-2xl font-bold">Usename</h2>
				<h2 className="p-4 pt-6 font-bold">{t('messages')}</h2>
				<div className="overflow-y-auto">
					{conversations.map((chat) => (
						<div
							key={chat.id}
							className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
							style={{
								color: "var(--text-color)",
								background: selectedChat === chat.id ? "var(--message-bg-color)" : "transparent",
								borderColor: "var(--white-to-gray)",
							}}
							onClick={() => setSelectedChat(chat.id)}
						>
							<img src={chat.img} alt={chat.name} className="w-15 h-15 rounded-full mr-3" />
							<div>
								<p className="font-normal" style={{ color: "var(--text-color)" }}>{chat.name}</p>
								<p className="text-sm" style={{ color: "var(--message-text-color)" }}>{chat.message}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Khung chat bên phải */}
			<div className="w-[100%] flex flex-col">
				{selectedChat ? (
					<div className="flex flex-col h-full">
						<div className="p-4 border-b flex items-center" style={{ borderColor: "var(--white-to-gray)" }}>
							<img
								src={conversations.find((chat) => chat.id === selectedChat)?.img}
								alt=""
								className="w-10 h-10 rounded-full mr-3"
							/>
							<p className="font-semibold">{conversations.find((chat) => chat.id === selectedChat)?.name}</p>
						</div>

						<div className="flex flex-col justify-center items-center mt-6">
							<img
								src={conversations.find((chat) => chat.id === selectedChat)?.img}
								alt=""
								className="w-25 h-25 rounded-full"
							/>
							<p className="text-[20px] font-semibold mt-2">{conversations.find((chat) => chat.id === selectedChat)?.name}</p>
						</div>

						{/* Nội dung tin nhắn */}
						<div className="flex-1 overflow-y-auto p-4">
							<p
								className="p-2 pl-4 rounded-3xl max-w-xs mb-2"
								style={{ color: "var(--text-color)", background: "var(--message-bg-color)", borderColor: "var(--white-to-gray)" }}
							>
								Hello!
							</p>
							<p className="bg-blue-400 text-white p-2 pl-4 rounded-3xl max-w-xs mb-2 ml-auto">Hi there! 👋</p>
						</div>

						{/* Input gửi tin nhắn */}
						<div className="flex items-center rounded-full px-4 focus:outline-none ml-4 mr-4 mb-4 border"
							style={{ borderColor: "var(--white-to-gray)" }}>
							<CommentInput />
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-full text-gray-500">
						Select a conversation to start chatting
					</div>
				)}
			</div>
		</div>
	);
}
