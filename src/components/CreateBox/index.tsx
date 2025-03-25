import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Modal, Button, Carousel, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./createBox.css"
import axios from "axios";

interface CreateBoxProps {
	onClose: () => void;
}

export default function CreateBox({ onClose }: CreateBoxProps) {
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	console.log("imagesimagesimages", images)


	// Chọn ảnh từ máy tính
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const imageUrl = URL.createObjectURL(event.target.files[0]);
			setImages((prev) => [...prev, imageUrl]); // Thêm vào danh sách ảnh
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
			const formData = new FormData();

			// 1️⃣ Thêm dữ liệu `postCreateRequest`
			const postCreateRequest = {
				userId: 1,
				content: "aa",
				visibility: "PUBLIC",
				typePost: "TEXT",
			};
			formData.append("postCreateRequest", JSON.stringify(postCreateRequest));

			// 2️⃣ Chuyển `Blob URL` thành `File`
			for (let i = 0; i < images.length; i++) {
				const response = await fetch(images[i]);
				const blob = await response.blob();
				const file = new File([blob], `image${i}.png`, { type: blob.type });
				formData.append("files", file);
			}

			// 3️⃣ In dữ liệu kiểm tra
			console.log("🟢 Đang gửi API với FormData:");
			for (let pair of formData.entries()) {
				console.log(pair[0], pair[1]);
			}

			// 4️⃣ Gửi API với Bearer Token
			const response = await axios.post("http://localhost:9999/api/posts", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMDEiLCJpYXQiOjE3NDI4NjQyNzAsImV4cCI6MTc0Mjg2NjA3MH0.XFxyFEYl-G3PKdbUK1AqXSW0aJlK97Msf8zvMbNjjCk`
				},
			});

			message.success("✅ Post created successfully!");
			console.log("✅ Post created:", response.data);
		} catch (error) {
			message.error("❌ Error creating post!");
			console.error("❌ Error creating post:", error);
		}
	};


	return (
		<div className="overlay" >
			<div className="rounded-xl" onClick={(e) => e.stopPropagation()}>
				<div className="flex justify-between items-center flex-col w-[1000px] h-[90vh] bg-red-50 rounded-xl">
					<div className="bg-black w-full text-white font-medium text-[20px] rounded-t-xl text-center p-2 flex justify-between items-center">
						<div className="">
						</div>
						<div className="ml-30">
							Create new post
						</div>
						<div className="" onClick={handlePostCreate}>
							Create Post
						</div>
					</div>
					<div className="flex w-full h-full">
						{/* Khu vực hiển thị ảnh */}
						<div className="bg-gray-700 h-full w-[60%] rounded-bl-xl flex items-center justify-center flex-col">
							{images.length > 0 ? (
								<div className="w-full h-full relative">
									<Carousel infinite={false}
										arrows >
										{images.map((img, index) => (
											<img
												key={index}
												src={img}
												alt="Selected"
												className="h-[85vh] w-[70%]  object-cover rounded-bl-xl"
											/>
										))}
									</Carousel>
									<button
										className="bg-white absolute bottom-5 right-10 p-2 rounded-lg shadow-md"
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
						<div className="bg-gray-600 h-full w-[50%] rounded-br-xl flex items-center justify-center flex-col overflow-auto">
							<div className="comment">Comment</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal chỉnh sửa ảnh */}
			<Modal
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
				centered
				className="model_post"
			>
				<div className="flex">
					{/* Danh sách ảnh hiện tại */}
					<div className="flex flex-wrap gap-3 ">
						{images.map((img, index) => (
							<div key={index} className="relative group">
								<img src={img} alt="Selected" className="w-24 h-24 object-cover rounded" />
								<button
									className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-80 hover:opacity-100 transition"
									onClick={() => handleRemoveImage(index)}
								>
									Xóa
								</button>
							</div>
						))}
					</div>

					{/* Thêm ảnh mới */}
					<Upload
						showUploadList={false}
						beforeUpload={(file) => {
							handleAddImage(file);
							return false;
						}}
					>
						<button className="w-24 h-24  rounded flex items-center justify-center gap-2" >
							+
						</button>
					</Upload>
				</div>
			</Modal >

		</div >
	);
}
