import { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRegBookmark } from "react-icons/fa";
import CommentInput from "../CommentInput/CommentInput";
import { Modal, Carousel } from 'antd';
import { calc } from "antd/es/theme/internal";

const contentStyle: React.CSSProperties = {
	margin: 0,
	height: '160px',
	color: '#fff',
	lineHeight: '160px',
	textAlign: 'center',
	background: '#364d79',
};
const InstagramPost = () => {
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const images = [
		"/public/images/uifaces-popular-image (11).jpg",
		"/public/images/uifaces-popular-image (11).jpg",
		"/public/images/uifaces-popular-image (11).jpg",
		"/public/images/uifaces-popular-image (11).jpg",
	];
	return (
		<div className="max-w-[470px] h-[900px] bg-white border-t border-gray-300 pt-2">
			{/* Header */}
			<div className="flex items-center justify-between pt-3 pb-3">
				<div className="flex items-center gap-3">
					<img
						src="/public/images/uifaces-popular-image (11).jpg"
						alt="Avatar"
						className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
					/>
					<span className="font-semibold text-gray-800">username</span>
				</div>
				<p className="text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" fill="#262626" />
					<path d="M6 13.5C6.82843 13.5 7.5 12.8284 7.5 12C7.5 11.1716 6.82843 10.5 6 10.5C5.17157 10.5 4.5 11.1716 4.5 12C4.5 12.8284 5.17157 13.5 6 13.5Z" fill="#262626" />
					<path d="M18 13.5C18.8284 13.5 19.5 12.8284 19.5 12C19.5 11.1716 18.8284 10.5 18 10.5C17.1716 10.5 16.5 11.1716 16.5 12C16.5 12.8284 17.1716 13.5 18 13.5Z" fill="#262626" />
				</svg></p>
			</div>

			{/* Post Image */}
			<Carousel
				infinite={false}
				arrows className="ant-custom">
				<img
					src="/public/images/uifaces-popular-image (11).jpg"
					alt="Post"
					className="w-full h-[585px] object-cover rounded-lg"
				/>
				<img
					src="/public/images/uifaces-popular-image (11).jpg"
					alt="Post"
					className="w-full h-[585px] object-cover rounded-lg"
				/>
				<img
					src="/public/images/uifaces-popular-image (11).jpg"
					alt="Post"
					className="w-full h-[585px] object-cover rounded-lg"
				/>
			</Carousel>

			{/* Actions */}
			<div className="flex justify-between pt-4">
				<div className="flex items-center gap-5">
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
			<div className="pt-3">
				<p className="font-semibold">1,234 likes</p>
				<p><span className="font-semibold">username</span> This is a sample caption! #hashtag</p><p className="cursor-pointer text-blue-500 font-semibold" onClick={() => setIsModalOpen(true)}>Xem thêm 100 comments</p>
			</div>

			{/* Comment Input */}
			<div className="mt-2 pt-2 ">
				<CommentInput />
			</div>

			{/* Modal hiển thị hình ảnh + comments */}
			<Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={"70%"}
				centered className="model-custom" height={"90%"}>
				<div className="flex">
					{/* Hình ảnh bên trái */}
					<div className="w-[55%]">
						<Carousel infinite={false} arrows>
							{images.map((img, index) => (
								<img key={index} src={img} alt="Post" className="w-full h-[90vh] object-cover" />
							))}
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
};

export default InstagramPost;
