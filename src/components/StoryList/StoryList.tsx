import { useEffect, useRef, useState } from "react";
import "./index.css"
import InstagramPost from "../InstagramPost/InstagramPost";
import { getPosts } from "../../services/post";
import { useRefresh } from "../../contexts/RefreshContext";

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


const StoryList = () => {
	const listRef = useRef<HTMLDivElement>(null);

	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		isDragging.current = true;
		if (listRef.current) {
			startX.current = e.pageX - listRef.current.offsetLeft;
			scrollLeft.current = listRef.current.scrollLeft;
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging.current || !listRef.current) return;
		e.preventDefault();
		const x = e.pageX - listRef.current.offsetLeft;
		const walk = (x - startX.current) * 0.8; // Tăng tốc độ kéo
		listRef.current.scrollLeft = scrollLeft.current - walk;
	};

	const handleMouseUp = () => {
		isDragging.current = false;
	};

	const [posts, setPosts] = useState<Post[]>([]);

	const { refreshTrigger, refresh } = useRefresh(); // Lấy giá trị từ context

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response: any = await getPosts();
				const currentUserId = localStorage.getItem("userId");

				const filteredPosts = response?.data?.filter((post: any) => {
					return (
						post.visibility === "PUBLIC" ||
						(post.visibility === "PRIVATE" && String(post.userId) === currentUserId)
					);
				});

				setPosts(filteredPosts);
			} catch (error) {
				console.error("Không thể lấy bài viết:", error);
			}
		};

		fetchPosts();
	}, [refreshTrigger]);

	
	console.log("Filtered posts:", posts);
	return (
		<div className="home">
			<div
				ref={listRef}
				className="list-story flex gap-4 overflow-x-auto max-w-[640px] p-2 mt-3 whitespace-nowrap scrollbar-hide cursor-grab active:cursor-grabbing relative z-10"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseUp}
				onMouseUp={handleMouseUp}
			>
				{[...Array(10)].map((_, index) => (
					<div key={index} className="item flex flex-col items-center shrink-0">
						<img
							className="w-17 h-17 rounded-full border-2 border-pink-500 p-0.5 object-cover"
							src="/public/images/uifaces-popular-image (11).jpg"
							alt=""
							draggable="false"
						/>
						<p className="text-[13px]  text-center">Name</p>
					</div>
				))}
			</div>
			<div className="list-post ml-22 mt-[-10px]">
				{posts?.map((post: Post, index) => (
					<div key={index}><InstagramPost post={post} onRefresh={refresh} /></div>
				))}
			</div>
		</div>
	);
};

export default StoryList;
