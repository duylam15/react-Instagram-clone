import { useRef } from "react";
import "./index.css"
import InstagramPost from "../InstagramPost/InstagramPost";

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

	return (
		<div className="home">
			<div
				ref={listRef}
				className="list-story flex gap-4 overflow-x-auto max-w-[640px] p-2 mt-3 whitespace-nowrap scrollbar-hide cursor-grab active:cursor-grabbing"
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
						<p className="text-[13px]  text-center">dasda</p>
					</div>
				))}
			</div>
			<div className="list-post ml-22 mt-10">
				<InstagramPost />
				<InstagramPost />
				<InstagramPost />
			</div>
		</div>
	);
};

export default StoryList;
