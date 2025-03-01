import React, { useState } from "react";
import { Input, List, Avatar, Spin } from "antd";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function Search() {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState<{ id: number; name: string; avatar: string }[]>([]);

	// Dữ liệu giả lập
	const users = [
		{ id: 1, name: "nguyenvana", avatar: "/images/avatar1.jpg" },
		{ id: 2, name: "tranthib", avatar: "/images/avatar2.jpg" },
		{ id: 3, name: "hoangminhc", avatar: "/images/avatar3.jpg" },
		{ id: 4, name: "phamtand", avatar: "/images/avatar4.jpg" },
	];

	// Xử lý khi nhập vào input
	const handleSearch = (value: string) => {
		setQuery(value);
		setLoading(true);

		// Giả lập gọi API (chậm 500ms để tạo hiệu ứng loading)
		setTimeout(() => {
			const filtered = users.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
			setResults(filtered);
			setLoading(false);
		}, 500);
	};

	// Xóa input khi nhấn vào icon X
	const handleClear = () => {
		setQuery("");
		setResults([]);
	};

	return (
		<div className="w-[400px] bg-white relative">
			<div className="text-[24px] font-medium mt-3 p-3">Tìm kiếm</div>

			{/* Ô tìm kiếm */}
			<div className="mt-6 p-3 ">
				<Input
					className="custom-input"
					placeholder="Tìm kiếm"
					value={query}
					onChange={(e) => handleSearch(e.target.value)}
					suffix={
						loading ? (
							<Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} size="small" />
						) : query ? (
							<CloseCircleOutlined
								onClick={handleClear}
								style={{ cursor: "pointer", fontSize: 18 }}
							/>
						) : null
					}
				/>
			</div>

			{/* Danh sách gợi ý */}
			{query && (
				<div className="absolute w-full bg-white rounded-md mt-1 z-10 ">
					{loading ? (
						<div className="absolute top-[-45px] right-[25px]">
						</div>
					) : results.length > 0 ? (
						<List
							dataSource={results}
							renderItem={(item) => (
								<div className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-3">
									<img src="/public/images/uifaces-popular-image (11).jpg" className="w-10 h-10 rounded-full" />
									<div className="flex flex-col items-start justify-center">
										<div className="font-medium text-[15px]">{item.name}</div>
										<div>100k folo</div>
									</div>
								</div>
							)}
						/>
					) : (
						<p className="p-2 text-gray-500">Không có kết quả</p>
					)}
				</div>
			)}
		</div>
	);
}
