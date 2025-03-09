import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Avatar({ width, height }: { width: string, height: string }) {
	const { t } = useTranslation();

	return (
		<div className='flex  items-center justify-center gap-3'>
			<img src="/public/images/uifaces-popular-image (11).jpg" className={`${width} ${height} rounded-full`} />
			<div className="font-medium text-[15px] flex flex-col gap-0">
				<p>username</p>
				<p className='text-[14px] font-light'>{t('suggested_for_you')}</p>
			</div>
		</div>
	)
}
