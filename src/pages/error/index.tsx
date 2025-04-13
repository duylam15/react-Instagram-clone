import React from 'react'

export default function Error() {
	return (
		<div className="text-center py-20">
			<h1 className="text-3xl font-bold mb-4 text-red-500">Có lỗi xảy ra 😢</h1>
			<p className="mb-4">Trang bạn đang tìm kiếm không thể hiển thị hoặc đã xảy ra lỗi không mong muốn.</p>
			<a href="/" className="text-blue-500 underline">Quay lại trang chủ</a>
		</div>
	)
}
