import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRegBookmark } from "react-icons/fa";
import CommentInput from "../CommentInput/CommentInput";
import { Modal, Carousel } from 'antd';
import { IconDots } from "../icons/ic_dots";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { formatTimeAgo } from "../../utils/date";
import CommentSection from "../../views/comment/Comment";

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



const InstagramPost = ({ post }: { post?: Post }) => {
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Lấy giá trị theme từ context
	const { theme } = useTheme();

	// Lấy hàm dịch `t` từ i18n
	const { t } = useTranslation();
	const iconColor = theme === "dark" ? "white" : "black";
	const [isOpen, setIsOpen] = useState(false);

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
							<p className="p-2 hover:bg-gray-100 cursor-pointer">Xóa</p>
							<p className="p-2 hover:bg-gray-100 cursor-pointer">Sửa</p>
						</div>
					)}
				</div>
			</div>

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
		</div>
	);
};

export default InstagramPost;
