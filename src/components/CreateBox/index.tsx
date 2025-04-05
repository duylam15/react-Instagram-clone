import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Modal, Button, Carousel, Upload, message, Spin } from "antd";
import { LeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";
import "./createBox.css"
import axios from "axios";
import { FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { createPost } from "../../services/post";
import { useRefresh } from "../../contexts/RefreshContext";

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
		try {
			setLoading(true); // Bắt đầu loading
			const data = await createPost(1, comment, images);
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

	return (
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

							<button className="rounded" onClick={handlePostCreate}>Create Post</button>
						</div>
						<div className="flex w-full h-[90vh]">
							{/* Khu vực hiển thị ảnh */}
							<div className="bg-gray-700 h-full max-w-[60%] w-full rounded-bl-xl flex items-center justify-center flex-col">
								{images.length > 0 ? (
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
											onClick={() => setIsModalOpen(true)}
										>
											Chỉnh sửa ảnh
										</button>
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
									<div className="flex items-center justify-start">
										<img src="/public/images/uifaces-popular-image (7).jpg" alt=""
											className="w-[50px] h-[50px] rounded-full" />
										<div className="text-white">UserName</div>
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
			{/* Modal chỉnh sửa ảnh */}
			{isModalOpen &&
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
		</div >
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