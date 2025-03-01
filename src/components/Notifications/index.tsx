import React from 'react'

export default function Notifications() {
	return (
		<div className="w-[400px] bg-white relative">
			<div className="text-[24px] font-bold mt-3 p-4">Thông báo</div>
			<div className="text-[16px] font-bold  p-4">Trước đó</div>
			<div className="cursor-pointer hover:bg-gray-100 p-3 flex items-center justify-center gap-3 p-4">
				<img src="/public/images/uifaces-popular-image (11).jpg" className="w-10 h-10 rounded-full" />
				<div className="flex  items-center justify-center gap-2">
					<div className="font-medium text-[15px]">username <strong className='font-normal'>đã bắt đầu theo dõi bạn</strong><strong className='font-light'> 1 tuần </strong></div>
					<div className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[180px] h-[32px] leading-[100%] flex items-center justify-center text-black-600">
						Đang theo dõi
					</div>
				</div>
			</div>
		</div>
	)
}
