import { useEffect, useState, useRef } from "react";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRegBookmark, FaSmile } from "react-icons/fa";
import CommentInput from "../CommentInput/CommentInput";
import { Modal, Carousel, message, Upload, Spin } from 'antd';
import { IconDots } from "../icons/ic_dots";
import { useTranslation } from "react-i18next";
import { formatTimeAgo } from "../../utils/date";
import CommentSection from "../../views/comment/Comment";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { deletePostService, updatePost } from "../../services/post";
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

interface InstagramPostProps {
	post?: Post;
	onRefresh: () => void;
}

const InstagramPost = ({ post, onRefresh }: InstagramPostProps) => {
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenPut, setIsOpenPut] = useState(false);
	const { t } = useTranslation();
	const [isModalOpenPut, setIsModalOpenPut] = useState(false);
	const [images, setImages] = useState<any>();
	const [comment, setComment] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const [loading, setLoading] = useState(false);
	const [comments, setComments] = useState<any[]>(post?.comments || []);
	const commentInputRef = useRef<HTMLInputElement>(null);
	const [parentCommentId, setParentCommentId] = useState<number | null>(null);
	const [username, setUsername] = useState("");
	const [user, setUser] = useState<any>();

	useEffect(() => {
		if (post?.postMedia) {
			const mediaUrls = post.postMedia.map(media => media);
			setImages(mediaUrls);
		}
		if (post?.content) {
			setComment(post?.content);
		}
	}, [post]);  // Chạy khi `post` thay đổi

	console.log("pxxxosts", images)

	const handleDelete = async (postId: number) => {
		try {
			const result = await deletePostService(postId);
			alert(result.message);
			setIsOpen(false);
			onRefresh();
		} catch (error: any) {
			alert(error.message || "Lỗi khi xóa bài viết!");
		}
	};

	const postId = post?.postId
	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('userId');

	const handleLikeClick = async () => {
		const token = localStorage.getItem('token');
		const postId = post?.postId;
		const userId = localStorage.getItem('userId');

		if (!token || !userId || !postId) {
			console.error("Thông tin cần thiết chưa có.");
			return;
		}

		try {
			// Gửi yêu cầu POST lên server
			await axios.post('http://localhost:9999/api/post_emotions', {
				postId: postId,
				userId: userId,
				emotion: liked ? '' : '<3', // Nếu đã like thì bỏ (unlike), nếu chưa thì set cảm xúc <3
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Chuyển đổi trạng thái liked
			setLiked(!liked);
			onRefresh();

		} catch (error) {
			console.error("Lỗi khi gửi cảm xúc:", error);
		}
	};

	// Lấy thông tin user
	useEffect(() => {
		const fetchUserProfile = async () => {
			const token = localStorage.getItem('token');
			const userId = localStorage.getItem('userId');
			try {
				const response = await axios.get(`http://localhost:9999/api/api/users/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`, // Thêm token vào header
					},
				});
				setUsername(response?.data?.data?.userName);
				setUser(response?.data?.data);
			} catch (error) {
				console.error("Lỗi khi lấy thông tin profile:", error);
				setUsername("User not found");
			}
		};
		fetchUserProfile();
	}, [userId]);

	// Xóa ảnh
	const handleRemoveImage = async (postMediaId: number) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.delete(`http://localhost:9999/api/post-medias/${postMediaId}`, {
				headers: {
					Authorization: `Bearer ${token}`, // Thêm token vào header
				},
			});
			onRefresh();
			console.log(`Đã xoá ảnh có ID: ${postMediaId}`, response.data);
		} catch (error) {
			console.error('Lỗi khi xoá ảnh:', error);
			alert('Xoá ảnh thất bại. Vui lòng thử lại.');
		}
	};


	// Thêm ảnh mới
	const handleAddImage = (file: File) => {
		const imageUrl = URL.createObjectURL(file);
		setImages((prev: any) => [...prev, imageUrl]);
	};

	const handlePostUpdate = async () => {
		try {
			setLoading(true); // Bắt đầu loading
			const response = await updatePost(post?.postId, comment, images);
			if (response?.data?.imageUrl) {
				setImages([...images, response.data.imageUrl]);
			}
			console.log("✅ Phản hồi API:", response);
			onRefresh();
			handleClose()
		} catch (error) {
			console.error("❌ Lỗi khi cập nhật bài viết:", error);
		}
		finally {
			setLoading(false); // Kết thúc loading
		}
	};

	const handleEmojiSelect = (emoji: { native: string }) => {
		setComment((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	const handleClose = () => {
		setIsOpenPut(false)
	};

	// Hàm xử lý comment mới
	const handleNewComment = async (newComment: any) => {
		if (parentCommentId) {
		  try {
			const response = await axios.post(
			  `http://localhost:9999/api/comments/reply/${parentCommentId}`,
			  {
				postId: post?.postId,
				userId: localStorage.getItem("userId"),
				content: newComment.content,
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
	  
			const replyComment = {
			  ...response.data.data,
			  userName: localStorage.getItem("userName") || "User",
			  authorAvatarUrl: localStorage.getItem("userAvatar") || "/default-avatar.png",
			  createdAt: new Date().toISOString(),
			  numberEmotion: 0,
			  numberCommentChild: 0,
			  parentId: parentCommentId,
			};
	  
			// Chèn replyComment vào đúng vị trí trong mảng comments (dùng hàm đệ quy)
			const updateCommentsRecursively = (list: any[]): any[] => {
			  return list.map(comment => {
				if (comment.commentId === parentCommentId) {
				  return {
					...comment,
					numberCommentChild: (comment.numberCommentChild || 0) + 1,
					replies: [...(comment.replies || []), replyComment],
				  };
				} else if (comment.replies && comment.replies.length > 0) {
				  return {
					...comment,
					replies: updateCommentsRecursively(comment.replies),
				  };
				}
				return comment;
			  });
			};
	  
			setComments(prev => updateCommentsRecursively(prev));
			setParentCommentId(null); // Reset lại trạng thái reply
		  } catch (error) {
			console.error("Error replying to comment:", error);
		  }
		} else {
		  // Nếu là comment top-level, thêm vào cuối mảng
		  setComments(prev => [...prev, newComment]);
		}
	  };


	const handleReplyClick = (commentId: number) => {
		setParentCommentId(commentId);
		if (commentInputRef.current) {
			commentInputRef.current.focus();
		}
	};

	return (
		<div className={`max-w-[470px] pt-0 border-b border-gray-600`}>
			{/* Header */}
			<div className="flex items-center justify-between pt-3 pb-3">
				<div className="flex items-center gap-3">
					<img
						src={user?.urlAvatar}
						alt="Avatar"
						className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
					/>
					<span className="font-semibold text-gray-800" style={{ color: "var(--text-color)" }}>{username} </span>
					<span className="font-normal text-[14px] text-gray-400" style={{ color: "var(--white-to-gray)" }}>{formatTimeAgo(`${post?.createdAt}`, t)}  </span>
				</div>
				<div className="relative inline-block" style={{
					color: "var(--text-color)",
					background: " var(--bg-color)"
				}}
				>
					<p
						className=" cursor-pointer"

						onClick={() => setIsOpen(!isOpen)}
					>
						<IconDots color="gray" />
					</p>
					{isOpen && (
						<div className="absolute z-40 right-0  w-40 border   rounded-lg shadow-lg flex  flex-col text-center "
							style={{
								color: "var(--text-color)",
								background: " var(--white-to-gray)",
								lineHeight: 1,
								borderColor: "var(--white-to-gray)"
							}}>
							<p
								className="hover:bg-gray-100 cursor-pointer w-full text-center leading-[40px] m-0 rounded-t-lg"
								onClick={() => post?.postId && handleDelete(post.postId)}
								onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-color-hover)")}
								onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-color)")}>
								Xóa
							</p>
							<p
								className="hover:bg-gray-100 cursor-pointer w-full text-center leading-[40px] m-0 rounded-b-lg"
								onClick={() => post?.postId && setIsOpenPut(true)}
								onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-color-hover)")}
								onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-color)")}>
								Sửa
							</p>

						</div>
					)}
				</div>
			</div>

			{isOpenPut && <div className="overlay" onClick={() => handleClose()}>
				<div className="rounded-xl" onClick={(e) => e.stopPropagation()}>
					{loading ? (
						<Spin size="large" tip="Creating post..." />
					) : (
						<div className="flex justify-between items-center flex-col mt-[-20px] w-[1000px] h-[90vh]  rounded-xl">

							<div className="bg-black w-full text-white font-medium text-[20px] rounded-t-xl text-center p-2 flex justify-between items-center">
								<div className="">
								</div>
								<div className="ml-30">
									Update post
								</div>
								<div className="" onClick={handlePostUpdate}>
									Update Post
								</div>
							</div>
							<div className="flex w-full h-[90vh]">
								{/* Khu vực hiển thị ảnh */}
								<div className="bg-gray-700 h-full max-w-[60%] w-full rounded-bl-xl flex items-center justify-center flex-col">
									{1 && (
										<div className="w-full h-full relative">
											<Carousel infinite={false}
												arrows >
												{images.map((img: any, index: any) => (
													<img
														key={index}
														src={img?.mediaUrl}
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
					)}
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
										{images.map((img: any, index: any) => (
											<div key={index} className="relative">
												<img src={img?.mediaUrl} alt="Selected" className="w-[100px] h-[100px] object-cover rounded" />
												<div
													className="absolute top-2 right-8 bg-gray-500 text-white p-1 rounded opacity-80 hover:opacity-100 transition"
													onClick={() => handleRemoveImage(img?.postMediaId)}
												>
													Xóa
												</div>
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
										<div className="w-24 h-24 rounded flex items-center justify-center gap-2 bg-gray-500">
											+
										</div>
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
					<p onClick={handleLikeClick} className="text-xl">
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
				<p className="font-semibold">{post?.numberComment} {t('likes')}</p>
				<p><span className="font-semibold">{username}</span> {post?.content}</p><p className="cursor-pointer text-blue-500 font-semibold" onClick={() => setIsModalOpen(true)}>{t('view_more')} {post?.numberComment} {t('comment')} </p>
			</div>
			{/* Comment Input */}
			<div className="mt-2 pt-2">
				<CommentInput
					post={post}
					onCommentAdded={handleNewComment}
					ref={commentInputRef}
					parentCommentId={parentCommentId}
				/>
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
									<span className="font-semibold" style={{ color: "var(--text-color)" }}>{username}</span>
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

											<p className="p-2 hover:bg-gray-100 cursor-pointer" style={{ color: "var(--text-color)" }} onClick={() => post?.postId && setIsOpenPut(true)}>Sửa</p>
										</div>
									)}
								</div>
							</div>
							<div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3">
								<CommentSection
									comments={comments}
									post={post}
									onReplyClick={handleReplyClick}
								/>
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
							<div className="pl-5 pr-5 border-t"
								style={{ borderColor: "var(--white-to-gray)" }}
							>
								<CommentInput
									post={post}
									onCommentAdded={handleNewComment}
									ref={commentInputRef}
									parentCommentId={parentCommentId}
								/>
							</div>
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
		<LeftOutlined onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} />
	</div>
);

const CustomNextArrow = ({ onClick }: any) => (
	<div
		className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white text-gray p-2 rounded-[9999px] opacity-75 hover:opacity-100 transition flex items-center justify-center"
		onClick={onClick}
	>
		<RightOutlined onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} />
	</div>
);