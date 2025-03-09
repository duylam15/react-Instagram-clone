import React from 'react';
import StoryList from '../../components/StoryList/StoryList';
import Avatar from '../../components/Avatar';
import { useTranslation } from 'react-i18next';

export default function Home() {
	const { t } = useTranslation();
	return (
		<div className="home flex gap-25 justify-center  ml-30">
			<StoryList />
			<div className='w-80 mt-6'>
				<div className="flex  items-center justify-between gap-20">
					<Avatar height='h-12' width='w-12' />
					<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
						{t('switch')}
					</div>
				</div>
				<div className='flex items-center justify-between mt-7'>
					<div className='font-medium text-gray-500'>{t('suggested_for_you')}</div>
					<div className='font-medium text-[14px] text-black-500'>{t('view_all')}</div>
				</div>

				<div className="cursor-pointer flex flex-col gap-5 mt-4  justify-between w-full">
					<div className="flex  items-center justify-between gap-20">
						<Avatar height='h-12' width='w-12' />
						<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
							{t('follow')}
						</div>
					</div>
					<div className="flex  items-center justify-between gap-20">
						<Avatar height='h-12' width='w-12' />
						<div className=" rounded-md font-medium text-[14px]  leading-[100%] text-blue-400">
							{t('follow')}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
