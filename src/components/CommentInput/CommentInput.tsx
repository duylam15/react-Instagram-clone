import { useState, useRef } from "react";
import { FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const CommentInput = () => {
	const [comment, setComment] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const inputRef = useRef(null);

	const handleEmojiSelect = (emoji: { native: string }) => {
		setComment((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	const handleSubmit = () => {
		console.log("Nội dung comment:", comment);
		setComment(""); // Xóa nội dung sau khi đăng
	};

	return (
		<div className=" w-full relative">
			{/* Ô nhập comment */}
			<div className="flex items-center py-2">
				<input
					type="text"
					placeholder="Add a comment..."
					className="w-full border-none outline-none p-1"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					ref={inputRef}
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
						Gửi
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
