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
import { useRefresh } from "../../contexts/RefreshContext";
import "./InstagramPost.css"
import { getListFriends } from "../../services/friend/friend";
import { useNavigate } from "react-router-dom";
import { CustomNextArrow, CustomPrevArrow } from "./handle";
import { set } from "date-fns";
import { FaShareAlt } from 'react-icons/fa';

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
	// 📌 State quản lý UI chung
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [visibility, setVisibility] = useState<any>(post?.visibility);
	const [images, setImages] = useState<any>();
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(false);

	// 📌 State quản lý thông tin người dùng
	const [username, setUsername] = useState("");
	const [user, setUser] = useState<any>();
	const [listFriends, setListFriends] = useState<[]>(); // dùng để check isFriend

	// 📌 State liên quan đến modal, picker, popup
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenPut, setIsOpenPut] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpenPut, setIsModalOpenPut] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [showPicker, setShowPicker] = useState(false);

	// 📌 State comment dùng ở nhiều nơi
	const [comments, setComments] = useState<any[]>(post?.comments || []);
	const [parentCommentId, setParentCommentId] = useState<number | null>(null);

	// 📌 Ref dùng nhiều nơi
	const commentInputRef = useRef<HTMLInputElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	// 📌 Hooks & biến dùng chung
	const { t } = useTranslation();
	const { refreshTrigger, refresh } = useRefresh();
	const navigate = useNavigate();
	const postId = post?.postId;
	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('userId');
	const isFriend = listFriends?.some((friend: any) => friend?.user_id?.toString() === post?.userId?.toString());

	// Lấy danh sách bạn bè khi component mount
	useEffect(() => {
		const fetchListFriends = async () => {
			const token = localStorage.getItem('token');
			const userId: any = localStorage.getItem('userId');
			try {
				const response = await getListFriends({ idProfile: userId as number }, token);
				console.log("danh sach ban be")
				console.log(response)
				setListFriends(response?.data?.data)
			} catch (error) {
			}
		};
		fetchListFriends()
	}, [])

	useEffect(() => {
		const fetchLikeStatus = async () => {
			const token = localStorage.getItem('token');
			const userId = localStorage.getItem('userId');

			if (!post?.postId || !userId || !token) return;

			try {
				const response = await axios.get(`http://localhost:9999/api/post_emotions/check-exist-post-emotion/post/${post.postId}/user/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLiked(response.data.data); // true / false
			} catch (error) {
				console.error("Lỗi khi kiểm tra trạng thái like:", error);
			}
		};

		fetchLikeStatus();
	}, [post]);

	// Đóng menu tuỳ chọn khi click ra ngoài vùng menu
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowOptions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Set lại ảnh và nội dung khi post thay đổi
	useEffect(() => {
		if (post?.postMedia) {
			const mediaUrls = post.postMedia.map(media => media);
			setImages(mediaUrls);
		}
		if (post?.content) {
			setComment(post?.content);
		}
	}, [post]);  // Chạy khi `post` thay đổi

	// Đóng popup xác nhận xoá khi click ra ngoài
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Lấy thông tin người đăng bài khi post.userId hoặc refreshTrigger thay đổi
	useEffect(() => {
		const fetchUserProfile = async () => {
			const token = localStorage.getItem('token');
			try {
				const response = await axios.get(`http://localhost:9999/api/api/users/${post?.userId}`, {
					headers: {
						Authorization: `Bearer ${token}`, // Thêm token vào header
					},
				});
				setUsername(`${response?.data?.data?.firstName} ${response?.data?.data?.lastName}`);
				setUser(response?.data?.data);
			} catch (error) {
				console.error("Lỗi khi lấy thông tin profile:", error);
				setUsername("User not found");
			}
		};
		fetchUserProfile();
	}, [refreshTrigger, post?.userId]);

	// ❤️ Xử lý Like / Unlike bài viết
	const handleLikeClick = async () => {
		const token = localStorage.getItem('token');
		const postId = post?.postId;
		const userId = localStorage.getItem('userId');

		if (!token || !userId || !postId) {
			console.error("Thông tin cần thiết chưa có.");
			return;
		}

		try {
			if (liked) {
				// Unlike: Gửi DELETE request
				await axios.delete(`http://localhost:9999/api/post_emotions`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
					data: {
						postId,
						userId,
					},
				});
				setLiked(false);
			} else {
				// Like: Gửi POST request
				await axios.post('http://localhost:9999/api/post_emotions', {
					postId,
					userId,
					emotion: '<3',
				}, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setLiked(true);
			}
			onRefresh(); // cập nhật lại danh sách bài viết
		} catch (error) {
			console.error("Lỗi khi xử lý like/unlike:", error);
		}
	};

	// ❤️ Xử lý Like / Unlike bài viết
	const handleSharePost = async () => {
		const token = localStorage.getItem('token');
		const postId = post?.postId;
		const userId = localStorage.getItem('userId');

		if (!token || !userId || !postId) {
			console.error("Thông tin cần thiết chưa có.");
			return;
		}

		try {
			await axios.post('http://localhost:9999/api/post-shares', {
				postId,
				userId,
				"visibility": "PUBLIC"
			}, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setLiked(true);
			message.success("Chia sẻ bài viết thành công!");
			onRefresh(); // cập nhật lại danh sách bài viết
		} catch (error) {
			message.error("Chia sẻ bài viết thất bại!");
			console.error("Lỗi khi xử lý share bai viet:", error);
		}
	};


	// 🔚 Đóng modal chỉnh sửa bài viết
	const handleClose = () => {
		setIsOpenPut(false)
	};

	// 📝 Xử lý cập nhật bài viết
	const handlePostUpdate = async () => {
		// Check nếu thiếu thông tin thì return sớm
		if (!post?.postId || !comment?.trim() || !visibility) {
			message.warning("⚠️ Không đủ thông tin để cập nhật bài viết");
			return;
		}

		try {
			setLoading(true); // Bắt đầu loading

			const response = await updatePost(post.postId, comment, images, visibility);

			if (response?.data?.imageUrl) {
				setImages([...images, response.data.imageUrl]);
			}

			console.log("✅ Phản hồi API:", response);
			onRefresh();
			handleClose();
		} catch (error) {
			console.error("❌ Lỗi khi cập nhật bài viết:", error);
		} finally {
			setLoading(false); // Kết thúc loading
		}
	};

	// 📤 Thêm ảnh mới từ local vào bài viết
	const handleAddImage = (file: File) => {
		const imageUrl = URL.createObjectURL(file);
		const cleanUrl = imageUrl.replace("blob:", "");
		console.log("imageUrlimageUrl", cleanUrl); // Không còn 'blob:' ở đầu nữa
		setImages((prev: any) => [...prev, imageUrl]);
	};

	// 🖼️ Xử lý xoá ảnh khỏi bài viết (có thể đã upload hoặc chỉ là ảnh local)
	const handleRemoveImage = async (img: any) => {
		if (img?.postMediaId) {
			// Ảnh đã được upload lên server → gọi API xoá
			try {
				const token = localStorage.getItem('token');
				const response = await axios.delete(`http://localhost:9999/api/post-medias/${img.postMediaId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				onRefresh();
				console.log(`✅ Đã xoá ảnh server ID: ${img.postMediaId}`, response.data);
			} catch (error) {
				console.error("❌ Lỗi khi xoá ảnh từ server:", error);
				alert("Xoá ảnh thất bại. Vui lòng thử lại.");
			}
		} else {
			// Ảnh local (chưa upload) → xoá khỏi state
			setImages((prev: any[]) => prev.filter((i) => i !== img));
			console.log("🗑️ Đã xoá ảnh local:", img);
		}
	};

	// 👁️ Chọn chế độ hiển thị bài viết (PUBLIC / PRIVATE)
	const handleSelect = (value: "PUBLIC" | "PRIVATE") => {
		setVisibility(value);
		setShowOptions(false);
	};

	// 🗑️ Xử lý xoá bài viết
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

	// 💬 Gửi bình luận mới (cả comment chính và reply)
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
				refresh()

			} catch (error) {
				console.error("Error replying to comment:", error);
			}
		} else {
			// Nếu là comment top-level, thêm vào cuối mảng
			setComments(prev => [...prev, newComment]);
		}
	};

	// 🧵 Click "Trả lời" → focus input và set trạng thái reply
	const handleReplyClick = (commentId: number) => {
		setParentCommentId(commentId);
		if (commentInputRef.current) {
			commentInputRef.current.focus();
		}
	};

	// 😄 Xử lý khi chọn emoji từ emoji Picker
	const handleEmojiSelect = (emoji: { native: string }) => {
		setComment((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	console.log("postpostpost", post)

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
					<span
						className="font-semibold text-gray-800 hover:underline cursor-pointer"
						onClick={() =>
							navigate(user?.userId?.toString() === userId ? "/profile" : `/profile/${user?.userId}`)
						}
						style={{ color: "var(--text-color)" }}
					>
						{username}
					</span>
					<span className="font-normal text-[14px] text-gray-400" style={{ color: "var(--white-to-gray)" }}>{formatTimeAgo(`${post?.createdAt}`, t)}  </span>
					{post?.userId?.toString() !== userId && !isFriend && (
						<div className="text-blue-400 text-[14px]">{t('suggested_for_you')}</div>
					)}
				</div>
				<div className="relative inline-block" style={{
					color: "var(--text-color)",
					background: " var(--bg-color)"
				}}>
					<div ref={menuRef}>
						<div className="relative w-[20px] h-[20px]" onClick={() => setIsOpen(!isOpen)} >
							<svg viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg" stroke="#c2c2c2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="#c2c2c2"></path> <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="#c2c2c2"></path> <path d="M21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12Z" fill="#c2c2c2"></path> </g></svg>
						</div>
						{isOpen && post?.userId?.toString() === userId && (
							<div
								className="absolute z-40 right-0 w-40 border rounded-lg shadow-lg flex flex-col text-center"
								style={{
									color: "var(--text-color)",
									background: "var(--bg-color)",
									lineHeight: 1,
									borderColor: "var(--white-to-gray)",
								}}
							>
								<p
									className="custom-hover cursor-pointer w-full text-center leading-[40px] m-0 rounded-t-lg"
									onClick={() => post?.postId && handleDelete(post?.postId)}
								>
									Xóa
								</p>
								<p
									className="custom-hover cursor-pointer w-full text-center leading-[40px] m-0 rounded-b-lg"
									onClick={() => post?.postId && setIsOpenPut(true)}
								>
									Sửa
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Update Post */}
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
														src={img?.mediaUrl || img}
														alt="Selected"
														className="h-[83vh] w-[70%]  object-cover rounded-bl-xl"
													/>
												))}
											</Carousel>
											<button
												className="bg-black absolute bottom-5 right-10 shadow-md text-white pl-4 pr-4 rounded-xl"
												onClick={() => setIsModalOpenPut(true)}
											>
												Chỉnh sửa ảnh
											</button>
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
																{images && images.length > 0 ? (
																	<Carousel
																		dots={true}
																		className="w-[240px]"
																		arrows
																		prevArrow={<CustomPrevArrow />}
																		nextArrow={<CustomNextArrow />}
																		slidesToShow={2}
																	>
																		{images.map((img: any, index: number) => (
																			<div key={index} className="relative">
																				<img
																					src={img?.mediaUrl || img}
																					alt="Selected"
																					className="w-[100px] h-[100px] object-cover rounded"
																				/>
																				<div
																					className="absolute top-1 right-6 bg-gray-500 text-white p-1 rounded opacity-80 hover:opacity-100 transition"
																					onClick={() => handleRemoveImage(img)}
																				>
																					Xóa
																				</div>
																			</div>
																		))}
																	</Carousel>
																) : (
																	<div className="bg-black p-4 flex justify-center items-center rounded text-center text-sm text-white">
																		Không có hình ảnh nào
																	</div>
																)}
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
																	<button className="w-24 h-24 rounded flex items-center justify-center gap-2 bg-black" >
																		<svg viewBox="0 0 20 20" width="40px" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ccc"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ccc" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"></path> </g></svg>
																	</button>
																</Upload>
															</div>
														</div>
													</Modal>
												</div>
											}
										</div>
									)}
								</div>
								{/* Khu vực comment */}
								<div className="bg-gray-600 h-full w-[50%] rounded-br-xl  overflow-auto">
									<div className="comment p-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center justify-between">
												<img src={user?.urlAvatar} alt=""
													className="w-[50px] h-[50px] rounded-full" />
												<div className="text-white ml-4">{username}</div>
											</div>
											<div className="relative" onClick={() => setShowOptions((prev) => !prev)} ref={menuRef}>
												<svg viewBox="0 0 16 16" width="20px" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ccc"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8Z" fill="#ccc"></path> <path d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z" fill="#ccc"></path> <path d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z" fill="#ccc"></path> </g></svg>
												{showOptions && (
													<div className="absolute top-8 right-0 bg-black text-white rounded shadow-md z-50 w-32">
														<div
															onClick={() => handleSelect("PUBLIC")}
															className="flex items-center justify-between rounded p-2 hover:bg-gray-800 cursor-pointer"
														>
															<span>Public</span>
															{visibility === "PUBLIC" && (
																<span className="w-2 h-2 bg-green-500 rounded-full"></span>
															)}
														</div>
														<div
															onClick={() => handleSelect("PRIVATE")}
															className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer"
														>
															<span>Private</span>
															{visibility === "PRIVATE" && (
																<span className="w-2 h-2 bg-green-500 rounded-full"></span>
															)}
														</div>
													</div>
												)}
											</div>
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


			</div >
			}
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
							className="w-full min-h-[585px] object-cover rounded-lg"
						/>
					);
				})}
			</Carousel>

			{/* Actions */}
			<div className="flex justify-between pt-2">
				<div className="flex items-center gap-4">
					<p onClick={handleLikeClick} className="text-xl cursor-pointer">
						{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
					</p>
					<p className="text-xl cursor-pointer"><FaComment /></p>
					<p className="text-xl cursor-pointer"><FaPaperPlane /></p>
				</div>
				<div className="flex items-center gap-4">
					<p onClick={() => setSaved(!saved)} className="text-xl cursor-pointer">
						{saved ? <FaBookmark /> : <FaRegBookmark />}
					</p>
					<p onClick={handleSharePost} className="text-xl cursor-pointer">
						<FaShareAlt />
					</p>
				</div>

			</div>
			{/* Likes and Caption */}
			<div className="">
				<p className="font-semibold">{post?.numberEmotion} {t('likes')}</p>
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
										src={user?.urlAvatar}
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<span className="font-semibold" style={{ color: "var(--text-color)" }}>{username}</span>
								</div>

								<div className="relative inline-block" style={{
									color: "var(--text-color)",
									background: " var(--bg-color)"
								}}>
									<div ref={menuRef}>
										<div className="relative w-[20px] h-[20px]" onClick={() => setIsOpen(!isOpen)} >
											<svg viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg" stroke="#c2c2c2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10Z" fill="#c2c2c2"></path> <path d="M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="#c2c2c2"></path> <path d="M21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12Z" fill="#c2c2c2"></path> </g></svg>
										</div>
										{isOpen && post?.userId?.toString() === userId && (
											<div
												className="absolute z-40 right-0 w-40 border rounded-lg shadow-lg flex flex-col text-center"
												style={{
													color: "var(--text-color)",
													background: "var(--bg-color)",
													lineHeight: 1,
													borderColor: "var(--white-to-gray)",
												}}
											>
												<p
													className="custom-hover cursor-pointer w-full text-center leading-[40px] m-0 rounded-t-lg"
													onClick={() => {
														if (post?.postId) {
															handleDelete(post?.postId);
															setIsModalOpen(false);
														}
													}}
												>
													Xóa
												</p>
												<p
													className="custom-hover cursor-pointer w-full text-center leading-[40px] m-0 rounded-b-lg"
													onClick={() => {
														if (post?.postId) {
															setIsOpenPut(true);
															setIsModalOpen(false);
														}
													}}

												>
													Sửa
												</p>
											</div>
										)}
									</div>
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
			</Modal >
		</div >
	);
};

export default InstagramPost;


