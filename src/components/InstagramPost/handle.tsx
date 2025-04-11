import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export const CustomPrevArrow = ({ onClick }: any) => (
	<div
		className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white text-gray p-2 rounded-[9999px] opacity-75 hover:opacity-100 transition flex items-center justify-center"
		onClick={onClick}
	>
		<LeftOutlined onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} />
	</div>
);

export const CustomNextArrow = ({ onClick }: any) => (
	<div
		className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white text-gray p-2 rounded-[9999px] opacity-75 hover:opacity-100 transition flex items-center justify-center"
		onClick={onClick}
	>
		<RightOutlined onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} />
	</div>
);