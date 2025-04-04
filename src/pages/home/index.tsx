import React from 'react';
import StoryList from '../../components/StoryList/StoryList';
import Avatar from '../../components/Avatar';
import { useTranslation } from 'react-i18next';
import SuggestFriend from '../../components/SuggestFriend';

export default function Home() {
	return (
		<div className="home flex min-h-[100vh] gap-25 justify-center  ml-50">
			<StoryList />
			<SuggestFriend />
		</div>
	);
}
