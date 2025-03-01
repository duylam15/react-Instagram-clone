import React from 'react';
import StoryList from '../../components/StoryList/StoryList';

export default function Home() {
	return (
		<div className="home flex gap-25 justify-center  ml-30">
			<StoryList />
			<div className='w-80 mt-6'>
				<div className="flex  items-center justify-between gap-20">
					<div className='flex  items-center justify-center gap-3'>
						<img src="/public/images/uifaces-popular-image (11).jpg" className="w-12 h-12 rounded-full" />
						<div className="font-medium text-[15px] flex flex-col gap-0">
							<p>username</p>
							<p className='text-[14px] font-light'>Gợi ý cho bạn</p>
						</div>
					</div>
					<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
						Chuyển
					</div>
				</div>
				<div className='flex items-center justify-between mt-7'>
					<div className='font-medium text-gray-500'>Gợi ý cho bạn</div>
					<div className='font-medium text-[14px] text-black-500'>Xem tất cả</div>
				</div>

				<div className="cursor-pointer flex flex-col gap-5 mt-4  justify-between w-full">
					<div className="flex  items-center justify-between gap-20">
						<div className='flex  items-center justify-center gap-3'>
							<img src="/public/images/uifaces-popular-image (11).jpg" className="w-12 h-12 rounded-full" />
							<div className="font-medium text-[15px] flex flex-col gap-0">
								<p>username</p>
								<p className='text-[14px] font-light'>Gợi ý cho bạn</p>
							</div>
						</div>
						<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
							Theo dõi
						</div>
					</div>
					<div className="flex  items-center justify-between gap-20">
						<div className='flex  items-center justify-center gap-3'>
							<img src="/public/images/uifaces-popular-image (11).jpg" className="w-12 h-12 rounded-full" />
							<div className="font-medium text-[15px] flex flex-col gap-0">
								<p>username</p>
								<p className='text-[14px] font-light'>Gợi ý cho bạn</p>
							</div>
						</div>
						<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
							Theo dõi
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
