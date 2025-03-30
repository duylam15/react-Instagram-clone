import { useState, useRef } from "react";
import { FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTranslation } from "react-i18next";
import axios from "axios";

type PostMedia = {
	mediaId: number;
	mediaUrl: string;
};

type Post = {
	postId: number;
	userId: number;
	content: string;
	comments: [];
	typePost: string;
	visibility: string;
	createdAt: string;
	updatedAt: string;
	numberComment: number;
	numberEmotion: number;
	numberShare: number;
	postMedia: PostMedia[]; // Mảng chứa các media của bài post
};


const CommentInput = ( { post }: { post?: Post } ) => {
	const [comment, setComment] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const inputRef = useRef(null);
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);

	const userId = localStorage.getItem("userId")


	const handleEmojiSelect = (emoji: { native: string }) => {
		setComment((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	const handleSubmit = () => {
		if (!comment.trim()) return; // Không gửi nếu comment rỗng

		var postId = post?.postId;
		console.log(postId)
		setLoading(true);
		try {
			const response = axios.post("http://localhost:9999/api/comments", {
				postId,
				userId,
				content: comment,
				typeComment: "TEXT", // Giả sử comment dạng text
				numberEmotion: 0,
				numberCommentChild: 0,
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần auth
					"Content-Type": "application/json",
				},
			});

			setComment(""); // Reset ô nhập comment
		} catch (error) {
			console.error("Error creating comment:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className=" w-full relative">
			{/* Ô nhập comment */}
			<div className="flex items-center py-2">
				<input
					type="text"
					placeholder={t('Comment')}
					className="w-full border-none outline-none p-1"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					ref={inputRef}
					style={{ color: "var(--text-color)" }}
				/>

				{/* Nút mở Emoji Picker */}
				<FaSmile
					className="text-gray-500 cursor-pointer w-[25px] h-[25px]"
					onClick={() => setShowPicker(!showPicker)}
				/>
				{/* Nút Đăng chỉ hiển thị khi có nội dung */}
				{comment && (
					<p
						className="ml-4 text-blue-600 font-bold text-lg text-center "
						onClick={handleSubmit}
					>
						{t('send')}
					</p>
				)}

				{/* Hiển thị Emoji Picker */}
				{showPicker && (
					<div className=" absolute bottom-12 right-0 z-10">
						<Picker data={data} onEmojiSelect={handleEmojiSelect} />
					</div>
				)}

			</div>
		</div>
	);
};

export default CommentInput;
