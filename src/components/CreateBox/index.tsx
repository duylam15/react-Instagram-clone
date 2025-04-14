import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Modal, Button, Carousel, Upload, message, Spin } from "antd";
import { LeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";
import "./createBox.css"
import "./customModal.css"
import axios from "axios";
import { FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { checkContentPost, createPost } from "../../services/post";
import { useRefresh } from "../../contexts/RefreshContext";
import { colors } from "@mui/material";

interface CreateBoxProps {
	onClose: () => void;
}

export default function CreateBox({ onClose }: CreateBoxProps) {
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	const [comment, setComment] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const [loading, setLoading] = useState(false);
	const { refreshTrigger, refresh } = useRefresh(); // Lấy giá trị từ context
	const [isLoading, setIsLoading] = useState(false);
	const userId = localStorage.getItem("userId")
	const [username, setUsername] = useState("");
	const [user, setUser] = useState<any>("");
	const [showOptions, setShowOptions] = useState(false);
	const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
	const menuRef = useRef<HTMLDivElement>(null);

	const [violationReasons, setViolationReasons] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
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
	// Chọn ảnh từ máy tính
	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const imageUrl = URL.createObjectURL(event.target.files[0]);
			setImages((prev) => [...prev, imageUrl]); // Thêm vào danh sách ảnh
			const file = event.target.files[0];
			if (!file) return;
			const formData = new FormData();
			formData.append('file', file);
			setComment('Đang tự động tạo caption');
			setIsLoading(true);
			try {
				const token = localStorage.getItem('token');
				const response = await axios.post('http://localhost:9999/api/api/geminiGenImage/generate-caption', formData, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				});
				setComment(response.data);
			} catch (error) {
				console.error('Error uploading file', error);
				setComment('Lỗi khi tải hình ảnh lên.');
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleSelect = (value: "PUBLIC" | "PRIVATE") => {
		setVisibility(value);
		setShowOptions(false);
	};

	console.log("visibilityvisibility", visibility)


	useEffect(() => {
		const fetchUserProfile = async () => {
			const token = localStorage.getItem('token');
			const userId = localStorage.getItem('userId');
			try {
				const response = await axios.get(
					`http://localhost:9999/api/api/users/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`, // Thêm token vào header
						},
					}
				);
				setUsername(`${response?.data?.data?.firstName} ${response?.data?.data?.lastName}`);
				setUser(response?.data?.data)
			} catch (error) {
				console.error("Lỗi khi lấy thông tin profile:", error);
				setUsername("User not found");
			}
		};
		fetchUserProfile();
	}, []);

	console.log("userxx", user)


	// Xóa ảnh
	const handleRemoveImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index));
	};

	// Thêm ảnh mới
	const handleAddImage = (file: File) => {
		const imageUrl = URL.createObjectURL(file);
		setImages((prev) => [...prev, imageUrl]);
	};

	const handlePostCreate = async () => {
		if (!comment?.trim() || !visibility) {
			message.warning("⚠️ Không đủ thông tin để tạo bài viết");
			return;
		}
		try {
			setLoading(true); // Bắt đầu loading
			message.success("✅ Đang kiểm tra nội dung bài viết...");

			const data = await checkContentPost(comment);
			console.log("Dữ liệu kiểm duyệt:", data);

			if (data?.statusCode === 200) {
				if (data.data?.length === 0) {
					message.success("✅ Nội dung bài viết hợp lệ!");
				} else {
					message.error("❌ Nội dung bài viết không hợp lệ!");
					setViolationReasons(data.data);
					setIsModalVisible(true);
					setLoading(false);
					return;
				}
			} else {
				message.error("❌ Không thể kiểm tra nội dung bài viết. Mã lỗi: " + data?.statusCode);
				setLoading(false);
				return;
			}

			setLoading(false);
		} catch (error) {
			console.error("Lỗi kiểm duyệt:", error);
			message.error("❌ Đã xảy ra lỗi khi kiểm tra nội dung bài viết!");
			setLoading(false);
		}
		try {
			setLoading(true); // Bắt đầu loading
			const data = await createPost(userId, comment, images, visibility);
			message.success("✅ Post created successfully!");
			console.log("✅ Post created:", data);
			refresh()
		} catch (error) {
			message.error("❌ Error creating post!");
		} finally {
			setLoading(false); // Kết thúc loading
		}
		onClose()
	};

	const handleEmojiSelect = (emoji: { native: string }) => {
		setComment((prev) => prev + emoji.native); // Thêm emoji vào nội dung input
		setShowPicker(false); // Ẩn picker sau khi chọn
	};

	console.log("imagesimagesimages", images)

	return (
		<>
			<Modal
				title={<span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>❌ Nội dung bài viết không hợp lệ</span>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				centered
				closable={true}
				className="custom-modal"
			>
				<p className="modal-description">
					Hệ thống đã phát hiện các vấn đề sau trong nội dung bài viết:
				</p>

				<ul className="modal-list">
					{violationReasons.map((item: any, index: any) => (
						<li key={index}>
							<strong>{item?.fakeNewsSign}:</strong> {item?.reason}
						</li>
					))}
				</ul>

				<p className="modal-note">
					👉 Vui lòng chỉnh sửa lại nội dung bài viết để đảm bảo phù hợp và tôn trọng người đọc.
				</p>
			</Modal>
			<div className="overlay" onClick={onClose}>
				<div className="rounded-xl" onClick={(e) => e.stopPropagation()}>
					{loading ? (
						<Spin size="large" tip="Creating post..." />
					) : (
						<div className="flex justify-between items-center flex-col mt-[-20px] w-[1000px] h-[90vh]  rounded-xl">
							<div className="bg-black w-full text-white font-medium text-[20px] rounded-t-xl text-center flex justify-between items-center">
								<div className="">
								</div>
								<div className="ml-30">
									Create new post
								</div>

								<button className="rounded backround" onClick={handlePostCreate}>Create Post</button>
							</div>
							<div className="flex w-full h-[90vh]">
								{/* Khu vực hiển thị ảnh */}
								<div className="bg-gray-700 h-full max-w-[60%] w-full rounded-bl-xl flex items-center justify-center flex-col">
									{images.length > 0 ? (
										<div className="w-full h-full relative">
											<Carousel infinite={false}
												arrows >
												{images.map((media, index) => {
													const isVideo = media.endsWith(".mp4") || media.endsWith(".webm") || media.endsWith(".ogg");
													return isVideo ? (
														<video
															key={index}
															src={media}
															controls
															className="h-[83vh] w-[70%] object-cover rounded-bl-xl"
														/>
													) : (
														<img
															key={index}
															src={media}
															alt="Selected"
															className="h-[83vh] w-[70%] object-cover rounded-bl-xl"
														/>
													);
												})}

											</Carousel>
											<button
												className="bg-black absolute bottom-5 right-10 p-2 rounded-lg shadow-md"
												onClick={() => setIsModalOpen(true)}
											>
												Chỉnh sửa ảnh
											</button>
											{/* Modal chỉnh sửa ảnh */}
											{isModalOpen && (
												<div onClick={(e) => e.stopPropagation()} style={{ top: "20%" }}>
													<Modal
														open={isModalOpen}
														onCancel={() => setIsModalOpen(false)}
														footer={null}
														centered
														className="model_post"
														mask={false} // ❌ Tắt overlay
														style={{ top: "20%" }}
													>
														<div className=" list flex ">
															{/* Danh sách ảnh hiện tại */}
															<div className=" flex flex-wrap gap-3">
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
																				className="absolute top-1 right-6 bg-red-500 text-white p-1 rounded opacity-80 hover:opacity-100 transition"
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
																		<svg viewBox="0 0 20 20" width="40px" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ccc"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ccc" fill-rule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"></path> </g></svg>
																	</button>
																</Upload>
															</div>
														</div>
													</Modal>
												</div>
											)
											}
										</div>
									) : (
										<>
											<div className="w-[100px] h-[100px]">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 640 512"
												>
													<path
														fill="white"
														d="M256 0L576 0c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64l-320 0c-35.3 0-64-28.7-64-64l0-224c0-35.3 28.7-64 64-64zM476 106.7C471.5 100 464 96 456 96s-15.5 4-20 10.7l-56 84L362.7 169c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l80 0 48 0 144 0c8.9 0 17-4.9 21.2-12.7s3.7-17.3-1.2-24.6l-96-144zM336 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
													/>
												</svg>
											</div>
											<div className="text-white font-normal text-[24px]">
												Drag photos and videos here
											</div>
											<label
												htmlFor="fileUpload"
												className="p-2 mt-3 text-white font-normal text-[16px] bg-blue-500 rounded-xl cursor-pointer"
											>
												Select from computer
											</label>
											<input
												type="file"
												id="fileUpload"
												className="hidden"
												accept="image/*"
												onChange={handleImageUpload}
											/>
										</>
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
											<div className="flex items-center py-2 relative">
												<textarea
													placeholder={t('Comment')}
													className="w-full text-white outline-none  p-1 pr-3"
													value={comment}
													onChange={(e) => setComment(e.target.value)}
													style={{ color: "var(--text-color)" }}
												></textarea>
												<div className="flex items-center gap-2 ml-2">
													{isLoading && (
														<svg
															className="animate-spin h-5 w-5 text-white"
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
														>
															<circle
																className="opacity-25"
																cx="12"
																cy="12"
																r="10"
																stroke="currentColor"
																strokeWidth="4"
															></circle>
															<path
																className="opacity-75"
																fill="currentColor"
																d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
															></path>
														</svg>
													)}

													<FaSmile
														className="text-gray-500 cursor-pointer w-[25px] h-[25px]"
														onClick={() => setShowPicker(!showPicker)}
													/>
												</div>

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
		</>
	);

}


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