import React, { useState } from "react";
import { Input, List, Avatar, Spin } from "antd";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();

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
		<div className="w-[400px]  relative" style={{ background: "var(--bg-color)" }}>
			<div className="text-[24px] font-medium mt-3 p-3">{t('search')}</div>

			{/* Ô tìm kiếm */}
			<div className="mt-6 p-3 ">
				<input
					className="custom-input border px-4 py-2 rounded-md focus:outline-none w-full"
					placeholder={t('search')}
					value={query}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ borderColor: "var(--white-to-gray)" }}
				/>
				{loading ? (
					<Spin indicator={<LoadingOutlined
						style={{ fontSize: 18, position: "absolute", right: "12px", bottom: "-5px" }} spin />} size="small" />
				) : query ? (
					<CloseCircleOutlined
						onClick={handleClear}
						style={{ cursor: "pointer", fontSize: 18, position: "absolute", right: "25px", bottom: "24px" }}
					/>
				) : null}

			</div>

			{/* Danh sách gợi ý */}
			{query && (
				<div className="absolute w-full rounded-md mt-1 z-10 " style={{ background: "var(--bg-color)" }}>
					{loading ? (
						<div className="absolute top-[-45px] right-[25px]">
						</div>
					) : results.length > 0 ? (
						<List
							dataSource={results}
							renderItem={(item) => (
								<div className="cursor-pointer hover-effect p-3 flex items-center gap-3">
									<img src="/public/images/uifaces-popular-image (11).jpg" className="w-10 h-10 rounded-full" />
									<div className="flex flex-col items-start justify-center" style={{ color: "var(--text-color)" }}>
										<div className="font-medium text-[15px]">{item.name}</div>
										<div>100k {t('follows')}</div>
									</div>
								</div>
							)}
						/>
					) : (
						<p className="p-2 flex text-center items-center justify-center mt-40 text-gray-500">{t('no_results_found')}</p>
					)}
				</div>
			)}
		</div>
	);
}
