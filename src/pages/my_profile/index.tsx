import { Carousel, Modal } from "antd";
import React, { useState } from "react";
import CommentInput from "../../components/CommentInput/CommentInput";
import { IconDots } from "../../components/icons/ic_dots";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

export default function MyProfile() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const images = [
		"/images/uifaces-popular-image (12).jpg",
		"/images/uifaces-popular-image (13).jpg",
		"/images/uifaces-popular-image (14).jpg",
		"/images/uifaces-popular-image (5).jpg",
		"/images/uifaces-popular-image (6).jpg",
		"/images/uifaces-popular-image (7).jpg",
		"/images/uifaces-popular-image (14).jpg",
	];

	// Hàm mở modal khi click vào ảnh
	const handleImageClick = (img: any) => {
		setSelectedImage(img);
		setIsModalOpen(true);
	};

	// Lấy giá trị theme từ context
	const { theme } = useTheme();

	// Lấy hàm dịch `t` từ i18n
	const { t } = useTranslation();
	const iconColor = theme === "dark" ? "white" : "black";

	return (
		<div className=" ml-25 p-4 flex flex-col items-center ">
			{/* Thông tin người dùng */}
			<div className="flex items-center gap-30 mb-8">
				{/* Ảnh đại diện */}
				<div className="w-[168px] h-[168px] rounded-full overflow-hidden border-2 p-1.5  border-pink-500">
					<img
						src="/images/uifaces-popular-image (11).jpg"
						alt="Avatar"
						className=" object-cover rounded-[99px]"
					/>
				</div>

				{/* Thông tin cá nhân */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4 justify-center">
						<h2 className="text-xl font-normal">username</h2>
						<div className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[148px] h-[32px] leading-[100%] flex items-center justify-center text-black-600" style={{ background: "var( --hover-color)" }}>
							Đang theo dõi
						</div>
						<div className="bg-gray-200 px-4 py-1 rounded-md font-medium  text-[14px] text-center w-[100px] h-[32px] leading-[100%] flex items-center justify-center text-black-600" style={{ background: "var( --hover-color)" }}>
							Nhắn tin
						</div>
						<div className="bg-gray-200 px-4 py-1 rounded-md font-medium  text-[14px] text-center w-[30px] h-[32px] leading-[100%] flex items-center justify-center text-black-600" style={{ background: "var( --hover-color)" }}>
							+
						</div>
						<div className=" px-4 py-1 rounded-md font-medium  text-[14px] text-center w-[30px] h-[32px] leading-[100%] flex items-center justify-center text-black-600">
							<p className="text-gray-600"><IconDots color={iconColor} /></p>

						</div>
					</div>

					<div className="flex gap-6 mt-2">
						<span className="font-light"><strong className="font-bold">20</strong> {t('post')}</span>
						<span className="font-light"><strong className="font-bold">5.2K</strong> {t('follower')}</span>
						<span className="font-light"><strong className="font-bold">120</strong> {t('following')}</span>
					</div>

					<p className="mt-2 text-sm">Bio của bạn có thể ở đây ✨</p>
					<p className="mt-2 text-sm">Bio của bạn có thể ở đây ✨</p>
				</div>
			</div>
			{/* Danh sách bài viết */}
			{/* Danh sách ảnh */}
			<div className="grid grid-cols-3 gap-1">
				{images.map((img, index) => (
					<div key={index} className="aspect-square h-[410px] w-[308px] cursor-pointer" onClick={() => handleImageClick(img)}>
						<img src={img} alt="Post" className="w-full h-full object-cover" />
					</div>
				))}
			</div>

			{/* Modal hiển thị ảnh */}
			<Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={"70%"} centered>
				<div className="flex">
					{/* Hình ảnh bên trái */}
					<div className="w-[55%]">
						<Carousel infinite={false} arrows>
							{selectedImage && <img src={selectedImage} alt="Post" className="w-full h-[90vh] object-cover" />}
						</Carousel>
					</div>

					{/* Comments bên phải */}
					<div className="w-1/2 flex flex-col justify-between">
						<div className="overflow-y-auto h-[400px]">
							<div className="flex p-5  items-center gap-3 border-b border-gray-300 pb-3">
								<img
									src="/public/images/uifaces-popular-image (11).jpg"
									alt="Avatar"
									className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
								/>
								<span className="font-semibold text-gray-800">username</span>
							</div>
							<div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3">
								<div className="flex  items-center gap-3">
									<img
										src="/public/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold text-gray-800">username</span>
										<span className="font-semibold text-gray-800">username</span>
									</div>
								</div>
								<div className="flex  items-center gap-3">
									<img
										src="/public/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold text-gray-800">username</span>
										<span className="font-semibold text-gray-800">username</span>
									</div>
								</div><div className="flex  items-center gap-3">
									<img
										src="/public/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold text-gray-800">username</span>
										<span className="font-semibold text-gray-800">username</span>
									</div>
								</div><div className="flex  items-center gap-3">
									<img
										src="/public/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold text-gray-800">username</span>
										<span className="font-semibold text-gray-800">username</span>
									</div>
								</div>
							</div>
							{/* Thêm comments giả lập */}
						</div>

						<div className="pl-5 pr-5 border-t border-gray-300"><CommentInput /></div>

					</div>
				</div>
			</Modal>
		</div>
	);
}
