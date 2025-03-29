import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRegBookmark, FaSmile } from "react-icons/fa";
import CommentInput from "../CommentInput/CommentInput";
import { Modal, Carousel, message, Upload } from 'antd';
import { IconDots } from "../icons/ic_dots";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { formatTimeAgo } from "../../utils/date";
import CommentSection from "../../views/comment/Comment";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import axios from "axios";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

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

interface InstagramPostProps {
	post?: Post;
	onClose: () => void;
}

const InstagramPost = ({ post, onClose }: InstagramPostProps) => {
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	console.log("postpostpost", post)

	// Lấy giá trị theme từ context
	const { theme } = useTheme();

	// Lấy hàm dịch `t` từ i18n
	const iconColor = theme === "dark" ? "white" : "black";
	const [isOpen, setIsOpen] = useState(false);

	const handleDelete = async (postId: number) => {
		if (!postId) {
			alert("Không tìm thấy ID bài viết!");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("postUpdateRequest", JSON.stringify({ visibility: "DELETE" }));

			const response = await fetch(`http://localhost:9999/api/posts/${postId}`, {
				method: "PUT",
				body: formData,
			});

			if (response.ok) {
				alert("Xóa bài viết thành công!");
				setIsOpen(false);
			} else {
				alert("Xóa thất bại!");
			}
		} catch (error) {
			console.error("Lỗi khi xóa bài viết:", error);
		}
	};

	const [isOpenPut, setIsOpenPut] = useState(false);

	const { t } = useTranslation();
	const [isModalOpenPut, setIsModalOpenPut] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	console.log("postpostpost", post)
	const [comment, setComment] = useState("");
	console.log("commentcommentcomment", comment)
	useEffect(() => {
		if (post?.postMedia) {
			const mediaUrls = post.postMedia.map(media => media.mediaUrl);
			setImages(mediaUrls);
		}
		if (post?.content) {
			setComment(post?.content);
		}
	}, [post]);  // Chạy khi `post` thay đổi


	console.log("imagesimagesimages", images)
	const [showPicker, setShowPicker] = useState(false);

	// Xóa ảnh
	const handleRemoveImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index));
	};

	// Thêm ảnh mới
	const handleAddImage = (file: File) => {
		const imageUrl = URL.createObjectURL(file);
		setImages((prev) => [...prev, imageUrl]);
	};

	const handlePostUpdate = async () => {
		try {
			// 🛠 Kiểm tra postId hợp lệ
			if (!post?.postId) {
				message.error("❌ Lỗi: Không tìm thấy ID bài viết!");
				return;
			}

			// 🔹 Tạo FormData
			const formData = new FormData();

			// 🔹 Thêm dữ liệu bài viết (Tên chính xác: `postUpdateRequest`)
			const postUpdateRequest = {
				content: comment || "", // Đảm bảo không bị undefined
				visibility: "PRIVATE",
			};

			// 🟢 Debug: Kiểm tra dữ liệu gửi đi
			console.log("📝 postUpdateRequest:", postUpdateRequest);
			formData.append("postUpdateRequest", JSON.stringify(postUpdateRequest));

			// 🔹 Kiểm tra danh sách ảnh
			if (images.length > 0) {
				for (let i = 0; i < images.length; i++) {
					try {
						let file;

						if (images[i].startsWith("blob:")) {
							// Lấy file từ blob URL
							const response = await fetch(images[i]);
							const blob = await response.blob();
							file = new File([blob], `image${i}.png`, { type: blob.type });
						} else {
							// Nếu là ảnh từ URL (đã upload trước đó), không cần fetch lại
							file = images[i]; // Chỉ lưu URL, không cần append vào FormData
						}

						formData.append("newFiles", file);
						console.log(`✅ Ảnh ${i + 1} đã được thêm vào FormData`);
					} catch (error) {
						console.error(`❌ Lỗi tải ảnh ${i + 1}:`, error);
					}
				}
			}

			// 🟢 Kiểm tra FormData trước khi gửi
			console.log("🟢 FormData gửi đi:");
			for (let pair of formData.entries()) {
				console.log(pair[0], pair[1]);
			}

			// 🔹 Gửi API
			const response = await axios.put(
				`http://localhost:9999/api/posts/${post.postId}`,
				formData,
				{
					headers: {
						Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMDEiLCJpYXQiOjE3NDMyMzYxMzcsImV4cCI6MTc0MzIzNzkzN30.oa2TUUj9CyKSRUQlBj0DCGk-HnRL4jB4yV1BRg0CcyM`,
					},
				}
			);

			if (response.data?.data?.imageUrl) {
				setImages([...images, response.data.data.imageUrl]); // Cập nhật danh sách ảnh
			}
			console.log("imagesimagesxxx", response)


			// ✅ Hiển thị thông báo thành công
			message.success("✅ Bài viết đã được cập nhật thành công!");
			console.log("✅ Phản hồi API:", response.data);
		} catch (error) {
			message.error("❌ Lỗi khi cập nhật bài viết!");
			console.error("❌ Chi tiết lỗi:", error);
		}
	};

	const handleEmojiSelect = (emoji: { native: string }) => {
		setComment((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	console.log("Nội dung comment:", comment);
	const handleClose = () => {
		setIsOpenPut(false)
	};

	return (
		<div className={`max-w-[470px] h-[900px] var(--bg-color) pt-0 border-b border-gray-600`}>
			{/* Header */}
			<div className="flex items-center justify-between pt-3 pb-3">
				<div className="flex items-center gap-3">
					<img
						src="/public/images/uifaces-popular-image (11).jpg"
						alt="Avatar"
						className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
					/>
					<span className="font-semibold text-gray-800" style={{ color: "var(--text-color)" }}>{post?.userId} </span>
					<span className="font-normal text-[14px] text-gray-400" style={{ color: "var(--white-to-gray)" }}>{formatTimeAgo(`${post?.createdAt}`, t)}  </span>
				</div>
				<div className="relative inline-block">
					<p
						className="text-gray-600 cursor-pointer"
						onClick={() => setIsOpen(!isOpen)}
					>
						<IconDots color="gray" />
					</p>
					{isOpen && (
						<div className="absolute z-40 right-0  w-40 bg-white border rounded-lg shadow-lg p-2">
							<p
								className="p-2 hover:bg-gray-100 cursor-pointer"
								onClick={() => post?.postId && handleDelete(post.postId)}
							>
								Xóa
							</p>

							<p className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => post?.postId && setIsOpenPut(true)}>Sửa</p>
						</div>
					)}
				</div>
			</div>

			{isOpenPut && <div className="overlay" onClick={() => handleClose()}>
				<div className="rounded-xl" onClick={(e) => e.stopPropagation()}>
					<div className="flex justify-between items-center flex-col mt-[-20px] w-[1000px] h-[90vh]  rounded-xl">
						<div className="bg-black w-full text-white font-medium text-[20px] rounded-t-xl text-center p-2 flex justify-between items-center">
							<div className="">
							</div>
							<div className="ml-30">
								Create new post
							</div>
							<div className="" onClick={handlePostUpdate}>
								Create Post
							</div>
						</div>
						<div className="flex w-full h-[90vh]">
							{/* Khu vực hiển thị ảnh */}
							<div className="bg-gray-700 h-full max-w-[60%] w-full rounded-bl-xl flex items-center justify-center flex-col">
								{1 && (
									<div className="w-full h-full relative">
										<Carousel infinite={false}
											arrows >
											{images.map((img, index) => (
												<img
													key={index}
													src={img}
													alt="Selected"
													className="h-[83vh] w-[70%]  object-cover rounded-bl-xl"
												/>
											))}
										</Carousel>
										<button
											className="bg-black absolute bottom-5 right-10 p-2 rounded-lg shadow-md"
											onClick={() => setIsModalOpenPut(true)}
										>
											Chỉnh sửa ảnh
										</button>
									</div>
								)}
							</div>

							{/* Khu vực comment */}
							<div className="bg-gray-600 h-full w-[50%] rounded-br-xl  overflow-auto">
								<div className="comment p-3">
									<div className="flex items-center justify-start">
										<img src="/public/images/uifaces-popular-image (7).jpg" alt=""
											className="w-[50px] h-[50px] rounded-full" />
										<div className="text-white">UserName</div>
									</div>
									<div className="input-post mt-3">
										<div className="flex items-center py-2">
											<textarea
												placeholder={t('Comment')}
												className="w-full text-white outline-none  p-1"
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												style={{ color: "var(--text-color)" }}
											></textarea>

											{/* Nút mở Emoji Picker */}
											<FaSmile
												className="text-gray-500 cursor-pointer w-[25px] h-[25px]"
												onClick={() => setShowPicker(!showPicker)}
											/>

											{/* Hiển thị Emoji Picker */}
											{showPicker && (
												<div className=" absolute bottom-0 right-54 z-10">
													<Picker data={data} onEmojiSelect={handleEmojiSelect} />
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Modal chỉnh sửa ảnh */}
				{isModalOpenPut &&
					<div onClick={(e) => e.stopPropagation()} style={{ top: "20%" }}>
						<Modal
							open={isModalOpenPut}
							onCancel={() => setIsModalOpenPut(false)}
							footer={null}
							centered
							className="model_post"
							mask={false} // ❌ Tắt overlay
							style={{ top: "20%" }}
						>
							<div className="flex">
								{/* Danh sách ảnh hiện tại */}
								<div className="flex flex-wrap gap-3">
									<Carousel
										dots={true}
										className="w-[240px]"
										arrows
										prevArrow={<CustomPrevArrow />}
										nextArrow={<CustomNextArrow />}
										slidesToShow={2}
									>
										{images.map((img, index) => (
											<div key={index} className="relative">
												<img src={img} alt="Selected" className="w-[100px] h-[100px] object-cover rounded" />
												<button
													className="absolute top-2 right-8 bg-red-500 text-white p-1 rounded opacity-80 hover:opacity-100 transition"
													onClick={() => handleRemoveImage(index)}
												>
													Xóa
												</button>
											</div>
										))}
									</Carousel>
								</div>

								{/* Thêm ảnh mới */}
								<div className="ml-4">
									<Upload
										showUploadList={false}
										beforeUpload={(file) => {
											handleAddImage(file);
											return false;
										}}
									>
										<button className="w-24 h-24 rounded flex items-center justify-center gap-2">
											+
										</button>
									</Upload>
								</div>
							</div>
						</Modal>
					</div>
				}
			</div >}

			{/* Post Image or Video */}
			<Carousel infinite={false} arrows className="ant-custom">
				{post?.postMedia.map((postMedia: any) => {
					const isVideo = postMedia.mediaType === "video" || postMedia.mediaUrl.endsWith(".mp4");

					return isVideo ? (
						<video
							key={postMedia?.postMediaId}
							src={postMedia?.mediaUrl}
							controls
							className="w-full h-[585px] object-cover rounded-lg"
						/>
					) : (
						<img
							key={postMedia?.postMediaId}
							src={postMedia?.mediaUrl}
							alt="Post"
							className="w-full h-[585px] object-cover rounded-lg"
						/>
					);
				})}
			</Carousel>
			{/* Actions */}
			<div className="flex justify-between pt-2">
				<div className="flex items-center gap-4">
					<p onClick={() => setLiked(!liked)} className="text-xl">
						{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
					</p>
					<p className="text-xl"><FaComment /></p>
					<p className="text-xl"><FaPaperPlane /></p>
				</div>
				<p onClick={() => setSaved(!saved)} className="text-xl">
					{saved ? <FaBookmark /> : <FaRegBookmark />}
				</p>
			</div>
			{/* Likes and Caption */}
			<div className="">
				<p className="font-semibold">{post?.numberEmotion} {t('likes')}</p>
				<p><span className="font-semibold">{post?.userId}</span> {post?.content}</p><p className="cursor-pointer text-blue-500 font-semibold" onClick={() => setIsModalOpen(true)}>{t('view_more')} {post?.numberComment} {t('comment')} </p>
			</div>
			{/* Comment Input */}
			<div className="mt-2 pt-2 ">
				<CommentInput post={post} />
			</div>
			{/* Modal hiển thị hình ảnh + comments */}
			<Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={"70%"}
				centered className="model-custom" height={"90%"}>
				<div className="flex w-full h-full">
					{/* Hình ảnh bên trái */}
					<div className="w-[55%] h-[full] rounded-xl">
						<Carousel infinite={false} arrows className="carousel-custom">
							{post?.postMedia.map((postMedia: any) => (
								<img
									key={postMedia?.postMediaId}
									src={postMedia?.mediaUrl}
									alt="Post"
									className="w-full h-[90vh] object-cover rounded-l-lg"
								/>
							))}
						</Carousel>
					</div>

					{/* Comments bên phải */}
					<div className="w-1/2 flex flex-col justify-between h-full">
						<div className="overflow-y-auto h-[400px]">
							<div className="flex p-3 justify-between items-center gap-3 border-b  pb-3"
								style={{ borderColor: "var(--white-to-gray)" }}>
								<div className="flex items-center justify-center gap-3">
									<img
										src="/public/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<span className="font-semibold" style={{ color: "var(--text-color)" }}>{post?.userId}</span>
								</div>

								<div className="text-gray-600"><IconDots color={iconColor} /></div>
							</div>
							<div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3">
								<CommentSection comments={post?.comments} post={post} />
							</div>
						</div>
						<div>

							<div className="flex justify-between p-4 pb-0 border-t" style={{ borderColor: "var(--white-to-gray)" }}>
								<div className="flex items-center gap-3">
									<p onClick={() => setLiked(!liked)} className="text-xl">
										{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart style={{ color: "var(--text-color)" }} />}
									</p>
									<p className="text-xl" style={{ color: "var(--text-color)" }}><FaComment /></p>
									<p className="text-xl"><FaPaperPlane style={{ color: "var(--text-color)" }} /></p>
								</div>
								<p onClick={() => setSaved(!saved)} className="text-xl">
									{saved ? <FaBookmark style={{ color: "var(--text-color)" }} /> : <FaRegBookmark style={{ color: "var(--text-color)" }} />}
								</p>
							</div>
							<div className="p-4 pt-0 ">
								<p className="font-semibold text-[16px] p-0 m-0 " style={{ color: "var(--text-color)" }}>{post?.numberEmotion} {t('likes')}</p>
								<p className="font-light p-0 m-0 " style={{ color: "var(--text-color)" }}>{formatTimeAgo(`${post?.createdAt}`, t)} </p>
							</div>
							<div className="pl-5 pr-5 border-t "
								style={{ borderColor: "var(--white-to-gray)" }}
							><CommentInput post={post} /></div>
						</div>
					</div>
				</div>
			</Modal>
		</div >
	);
};

export default InstagramPost;


const CustomPrevArrow = ({ onClick }: any) => (
	<div
		className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white text-gray p-2 rounded-[9999px] opacity-75 hover:opacity-100 transition flex items-center justify-center"
		onClick={onClick}
	>
		<LeftOutlined />
	</div>
);

const CustomNextArrow = ({ onClick }: any) => (
	<div
		className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white text-gray p-2 rounded-[9999px] opacity-75 hover:opacity-100 transition flex items-center justify-center"
		onClick={onClick}
	>
		<RightOutlined />
	</div>
);