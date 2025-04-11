import React, { useEffect, useState } from 'react';
import Avatar from '../Avatar';
import { useTranslation } from 'react-i18next';
import { callUserProfile } from '../../services/auth';
import { getListUserNoPage } from '../../services/user/user';
import { getListFriends } from '../../services/friend/friend';
import axios from 'axios';
import OnlineBox from '../isOnline/isOnline';
import { useNavigate } from 'react-router-dom';
export default function SuggestFriend() {
	const { t } = useTranslation();
	const [userName, setUserName] = useState<string | null>("Name");
	const [userFirstName, setUserFirstName] = useState<string | null>("Name");
	const [listUser, setListUser] = useState([]);
	const [listFriends, setListFriends] = useState<{ friend_id: number }[]>([]);
	const [suggestedFriends, setSuggestedFriends] = useState([]);
	const [User, setUser] = useState<{ userId: number, urlAvatar: string } | null>(null);
	console.log("suggestedFriendssuggestedFriendssuggestedFriends", suggestedFriends)
	useEffect(() => {
		const fetchUser = async () => {
			const userId = localStorage.getItem('userId');
			const token = localStorage.getItem('token');
			if (userId) {
				try {
					const res: any = await callUserProfile(userId, token);
					setUser(res?.data?.data);
					setUserFirstName(res?.data?.data?.lastName);
					setUserName(`${res?.data?.data?.firstName} ${res?.data?.data?.lastName}`);
				} catch (error) {
					console.error("Error fetching user info:", error);
				}
			}
		};
		fetchUser();
	}, []);

	useEffect(() => {
		const fetchListUser = async () => {
			const token = localStorage.getItem('token');
			try {
				const res: any = await getListUserNoPage(token);
				setListUser(res?.data?.data);
			} catch (error) {
				console.error("Error fetching user list:", error);
			}
		};
		fetchListUser();
	}, []);

	useEffect(() => {
		const fetchListFriends = async () => {
			const token = localStorage.getItem('token');
			const userId = localStorage.getItem('userId');
			try {
				const response: any = await axios.get(
					`http://localhost:9999/api/friend/getlistfriends/${userId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setListFriends(response?.data?.data);
			} catch (error) {
				console.error("Error fetching friends list:", error);
			}
		};
		fetchListFriends();
	}, []);

	useEffect(() => {
		const fetchSuggestedFriends = async () => {
			console.log("📌 Danh sách bạn bè của người dùng hiện tại:", listFriends);
			console.log("📌 Danh sách tất cả người dùng:", listUser);

			// Nếu không có bạn bè, chọn ngẫu nhiên 5 người từ danh sách tất cả người dùng
			if (listFriends.length === 0) {
				const randomUsers = listUser
					.filter((user: any) => user.userId !== User?.userId) // Loại trừ chính người dùng
					.sort(() => Math.random() - 0.5)  // Sắp xếp ngẫu nhiên
					.slice(0, 5);  // Chọn 5 người ngẫu nhiên

				console.log("📌 Không có bạn bè gợi ý, lấy ngẫu nhiên 5 người:", randomUsers);
				setSuggestedFriends(randomUsers);
				return;
			}

			// Nếu có bạn bè, tiến hành lấy bạn bè của bạn bè
			let friendsOfFriends: any[] = [];
			for (const friend of listFriends) {
				try {
					const response = await axios.get(
						`http://localhost:9999/api/friend/getlistfriends/${friend.friend_id}`,
						{
							headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
						}
					);
					console.log(`✅ Bạn bè của ${friend.friend_id}:`, response?.data?.data);
					friendsOfFriends = [...friendsOfFriends, ...response?.data?.data];
				} catch (error) {
					console.error(`❌ Lỗi khi lấy danh sách bạn bè của ${friend.friend_id}:`, error);
				}
			}

			console.log("📌 Danh sách bạn bè của bạn bè (chưa lọc trùng):", friendsOfFriends);

			const uniqueFriendsOfFriends = Array.from(new Set(friendsOfFriends.map(f => f.user_id)))
				.filter(id => !listFriends.some(f => f.friend_id === id) && id !== User?.userId)
				.map(id => listUser.find((user: any) => user.userId === id))
				.filter(Boolean);

			console.log("📌 Danh sách bạn bè của bạn bè (đã lọc trùng và loại bỏ bạn bè hiện tại):", uniqueFriendsOfFriends);

			let finalSuggestedFriends: any = uniqueFriendsOfFriends.slice(0, 5);

			if (finalSuggestedFriends.length < 5) {
				const remaining = listUser
					.filter((user: any) => !listFriends.some(f => f.friend_id === user.userId) && user.userId !== User?.userId)
					.sort(() => Math.random() - 0.5)  // Sắp xếp ngẫu nhiên
					.slice(0, 5 - finalSuggestedFriends.length);  // Lấy đủ 5 người

				console.log("📌 Người dùng được chọn ngẫu nhiên để bổ sung:", remaining);

				finalSuggestedFriends = [...finalSuggestedFriends, ...remaining];
			}

			console.log("✅ Danh sách gợi ý kết bạn cuối cùng:", finalSuggestedFriends);

			setSuggestedFriends(finalSuggestedFriends);
		};

		fetchSuggestedFriends();
	}, [listFriends, listUser, User]);

	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

	const handleLogoutClick = () => {
		setIsLogoutModalOpen(true); // Mở modal khi click vào "switch"
	};

	const navigate = useNavigate();


	return (
		<div className='w-80 mt-6'>
			<div className="flex items-center justify-between gap-20">
				<Avatar height='h-12' width='w-12' userName={userName} active={userFirstName} avatar={User?.urlAvatar} />
				<div
					className="font-medium text-[14px] leading-[100%] text-blue-400 cursor-pointer"
					onClick={handleLogoutClick}
				>
					{t('switch')}
				</div>

			</div>

			<div className='flex items-center justify-between mt-7'>
				<div className='font-medium text-gray-500'>{t('suggested_for_you')}</div>
				<div className='font-medium text-[14px] text-black-500'>{t('view_all')}</div>
			</div>

			<div className="cursor-pointer flex flex-col gap-4 mt-4 justify-between w-full">
				{suggestedFriends.map((friend: any) => (
					<div key={friend?.userId} className="flex items-center justify-between gap-20">
						<Avatar height='h-12' friend={friend} width='w-12' userName={friend?.userName} avatar={friend?.urlAvatar} />
						<div className="rounded-md font-medium text-[14px] leading-[100%] text-blue-400">

						</div>
					</div>
				))}
			</div>
			<OnlineBox />
			{isLogoutModalOpen && (
				<div
					onClick={() => setIsLogoutModalOpen(false)}
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-5000">
					<div className="p-6 rounded-lg shadow-xl"
						style={{
							background: 'var(--bg-color)',
						}} >
						<div className="text-[20px] font-bold mb-4">Bạn có chắc muốn đăng xuất?</div>
						<div className="flex justify-end space-x-4"
							style={{
								background: 'var(--bg-color)',
								color: 'var(--text-color)',
							}}  >
							<button
								onClick={() => setIsLogoutModalOpen(false)}
								className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
							>
								Hủy
							</button>
							<button
								onClick={() => {
									localStorage.removeItem('userId');
									localStorage.removeItem('token');
									navigate('/login');
								}}
								className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
							>
								Đăng xuất
							</button>
						</div>
					</div>
				</div>
			)}

		</div>
	);
}
