import React from 'react'
import styles from "./SettingBox.module.css";
import { useTranslation } from 'react-i18next';



export default function Notifications() {
	const { t } = useTranslation();

	return (
		<div className="w-[400px] relative" >
			<div onClick={(e) => e.stopPropagation()}>
				<div className="text-[24px] font-bold mt-3 p-4">{t('notifications')}</div>
				<div className="text-[16px] font-bold  p-4">{t('previous')}</div>
				<div className="cursor-pointer hover-effect flex items-center justify-center gap-3 p-4">
					<img src="/public/images/uifaces-popular-image (11).jpg" className="w-10 h-10 rounded-full" />
					<div className="flex  items-center justify-center gap-2">
						<div className="font-medium text-[15px]">username<strong className='font-normal'>{t('started_following_you')}</strong><strong className='font-light'> 1 {t('week')} </strong></div>
						<div className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[180px] h-[32px] leading-[100%] flex items-center justify-center text-black-600" style={{ background: "var( --hover-color)" }}>
							{t('following')}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
