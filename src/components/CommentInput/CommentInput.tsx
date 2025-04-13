import { useState, useRef, forwardRef } from "react";
import { FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useRefresh } from "../../contexts/RefreshContext";

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

interface CommentInputProps {
	post?: Post;
	onCommentAdded?: (newComment: any) => void;
	children?: React.ReactNode;
	parentCommentId?: number | null;
}

const CommentInput = forwardRef<HTMLInputElement, CommentInputProps>(({ post, onCommentAdded, children, parentCommentId }, ref) => {
	const [comment, setComment] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const { refreshTrigger, refresh } = useRefresh();
	const userId = localStorage.getItem("userId");

	const handleEmojiSelect = (emoji: { native: string }) => {
		setComment((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	const handleSubmit = async () => {
		if (!comment.trim()) return; // Không gửi nếu comment rỗng

		const postId = post?.postId;
		setLoading(true);
		try {
			let response;
			if (parentCommentId) {
				// Nếu là reply comment, chỉ tạo object comment mới
				const newComment = {
					postId,
					userId,
					content: comment,
					typeComment: "TEXT",
					numberEmotion: 0,
					numberCommentChild: 0,
					userName: localStorage.getItem("userName") || "User",
					authorAvatarUrl: localStorage.getItem("userAvatar") || "/default-avatar.png",
					createdAt: new Date().toISOString(),
				};

				// Gọi callback để cập nhật UI
				if (onCommentAdded) {
					onCommentAdded(newComment);
				}
			} else {
				// Nếu là comment mới
				response = await axios.post(
					"http://localhost:9999/api/comments",
					{
						postId,
						userId,
						content: comment,
						typeComment: "TEXT",
						numberEmotion: 0,
						numberCommentChild: 0,
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
							"Content-Type": "application/json",
						},
					}
				);

				// Tạo comment mới với thông tin từ response
				const newComment = {
					...response.data.data,
					userName: localStorage.getItem("userName") || "User",
					authorAvatarUrl: localStorage.getItem("userAvatar") || "/default-avatar.png",
					createdAt: new Date().toISOString(),
					numberEmotion: 0,
					numberCommentChild: 0
				};

				// Gọi callback để cập nhật UI
				if (onCommentAdded) {
					onCommentAdded(newComment);
				}
			}

			setComment(""); // Reset ô nhập comment
			refresh()
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
					placeholder={parentCommentId ? t('Reply to comment') : t('Comment')}
					className="w-full border-none outline-none p-1"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					ref={ref}
					style={{ color: "var(--text-color)" }}
				/>

				{/* Nút mở Emoji Picker */}
				<FaSmile
					className="text-gray-500 cursor-pointer w-[25px] h-[25px]"
					onClick={() => setShowPicker(!showPicker)}
				/>
				{/* Nút Đăng chỉ hiển thị khi có nội dung */}
				{comment && (
					<div
						className="ml-4 text-blue-600 font-bold text-lg text-center"
						onClick={handleSubmit}
					>
						{t('send')}
					</div>
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
});

export default CommentInput;
