import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Avatar({ width, height, userName, active, avatar, friend }: { width: string, height: string, userName: string | null, active?: string | null, avatar: any, friend?: any }) {
	const { t } = useTranslation();
	console.log(friend?.userId)
	const navigate = useNavigate()
	return (
		<div className='flex  items-center justify-center gap-3'>
			<img src={avatar} className={`${width} ${height} rounded-full`} />
			<div className="font-medium text-[15px] flex flex-col gap-0">
				<p className="mb-0 hover:underline" onClick={() => navigate(`/profile/${friend?.userId || ""}`)}>{userName}</p>
				{active ?
					<p className='mb-0 text-[14px] font-light'>{active}</p> :
					<>
						<p className='mb-0 text-[14px] font-light'>{t('suggested_for_you')}</p> </>}
			</div>
		</div>
	)
}
