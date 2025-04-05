import { useState, useRef } from "react";
import { FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Định nghĩa kiểu cho props
interface MessageInputProps {
	conversationId: number;
	senderId: number;
	onMessageSent?: (message: any) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId, senderId, onMessageSent }) => {
	const [message, setMessage] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const inputRef = useRef(null);
	const { t } = useTranslation();
	const token = localStorage.getItem("token");
	const handleEmojiSelect = (emoji: { native: string }) => {
		setMessage((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	const handleSubmit = async () => {
		if (!message.trim()) return; // Không gửi tin nhắn rỗng

		const payload = {
			conversationId,
			senderId,
			typeMessage: "FILE",
			content: message.trim(),
		};

		try {
			const response = await axios.post("http://localhost:9999/api/messages/send", payload,{
				headers: {
					Authorization: `Bearer ${token}`, // Thêm token vào header
				},
			});
			console.log("Gửi tin nhắn thành công:", response.data.data);

			// Gửi tin nhắn mới về component cha (nếu cần cập nhật danh sách tin nhắn)
			// if (onMessageSent) onMessageSent(response.data.data);
			if (onMessageSent) {
				const sentMessage = response.data.data;
				const socket = new SockJS("http://localhost:9999/api/ws");
				const stompClient = Stomp.over(socket);

				// Kết nối STOMP trước khi publish
				stompClient.connect({ Authorization: `Bearer ${token}` },
					() => {
					console.log("WebSocket connected!");

					// Chỉ gửi tin nhắn khi kết nối thành công
					stompClient.send("/app/chat", {}, JSON.stringify(sentMessage));
					console.log("Tin nhắn đã gửi qua WebSocket:", sentMessage);
				});
			}
			// Xóa nội dung input sau khi gửi
			setMessage("");

			// Focus lại vào input
			// inputRef.current?.focus();
		} catch (error) {
			console.error("Lỗi khi gửi tin nhắn:", error);
		}
	};

	// Xử lý Enter để gửi tin nhắn
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="w-full relative">
			{/* Ô nhập tin nhắn */}
			<div className="flex items-center py-2">
				<input
					type="text"
					placeholder={t("Comment")}
					className="w-full border-none outline-none p-1"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					ref={inputRef}
					style={{ color: "var(--text-color)" }}
				/>

				{/* Nút mở Emoji Picker */}
				<FaSmile
					className="text-gray-500 cursor-pointer w-[25px] h-[25px]"
					onClick={() => setShowPicker(!showPicker)}
				/>

				{/* Nút Gửi */}
				{message && (
					<p
						className="ml-4 text-blue-600 font-bold text-lg text-center cursor-pointer"
						onClick={handleSubmit}
					>
						{t("send")}
					</p>
				)}

				{/* Hiển thị Emoji Picker */}
				{showPicker && (
					<div className="absolute bottom-12 right-0 z-10">
						<Picker data={data} onEmojiSelect={handleEmojiSelect} />
					</div>
				)}
			</div>
		</div>
	);
};

export default MessageInput;
