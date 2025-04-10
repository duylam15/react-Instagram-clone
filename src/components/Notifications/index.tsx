import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getListInviteReceived } from "../../services/friend/friend";
import { getUserById } from "../../services/user/user";
import { useNavigate } from "react-router-dom";
import { getListNotifyByIdReceiver, markReadNotifyByIdNotify } from "../../services/notity";

interface Invite {
	sender: number;
	receiver: number;
	status: string;
}

interface User {
	id: number;
	username: string;
	avatar?: string; // Giả sử API trả về URL ảnh đại diện
}

export interface Notify {
	noticeId: number;
	firstNameSender: string;
	lastNameSender: string;
	urlAvatarSender: string | null;
	type: 'friend' | 'like' | 'comment' | 'share' | string; // mở rộng nếu cần
	postId: number | null;
	content: string;
	referenceType: string | null;
	isRead: boolean;
	createdAt: string; // ISO date string
	isDeleted: boolean;
}

function getTimeAgo(dateString: string): string {
	const now = new Date();
	const past = new Date(dateString);
	const diffMs = now.getTime() - past.getTime();

	const seconds = Math.floor(diffMs / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (seconds < 60) return "Vừa xong";
	if (minutes < 60) return `${minutes} phút trước`;
	if (hours < 24) return `${hours} giờ trước`;
	if (days < 7) return `${days} ngày trước`;

	return past.toLocaleDateString("vi-VN"); // hoặc `return \`vào ngày ${...}\``
}

export default function Notifications() {
	const { t } = useTranslation();
	const [invites, setInvites] = useState<Invite[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const userId: any = localStorage.getItem('userId');
	const [notifications, setNotifications] = useState<Notify[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchInvites = async () => {
			try {
				const response = await getListInviteReceived({ idProfile: userId });
				if (response.status === 200 && response.data.data) {
					setInvites(response.data.data);

					// Gọi API lấy thông tin user cho mỗi sender
					const userDataArray: User[] = [];
					await Promise.all(
						response.data.data.map(async (invite: Invite) => {
							const user = await getUserById(invite.sender);
							if (user) userDataArray.push(user);
						})
					);
					setUsers(userDataArray);
				}
			} catch (error) {
				console.error("Lỗi khi lấy danh sách lời mời kết bạn:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchInvites();
	}, []);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await getListNotifyByIdReceiver(0, 99, 1);
				console.log("response NOtigi", response)
				if (response.statusCode === 200) {
					setNotifications(response.data.data);
				}
			} catch (error) {
				console.error("Lỗi khi lấy danh sách thông báo:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (userId) {
			fetchNotifications();
		}
	}, [userId]);
	console.log("notifications", notifications);

	const handleMarkAsRead = async (notificationId: number) => {
		await markReadNotifyByIdNotify(notificationId);
		setNotifications((prev) =>
			prev.map((notify) =>
				notify.noticeId === notificationId ? { ...notify, isRead: true } : notify
			)
		);
	}


	return (
		<div className="w-[400px] relative" onClick={(e) => e.stopPropagation()}>
			<div className="text-[24px] font-bold mt-3 p-4">{t("notifications")}</div>
			<div className="list-notify mt-4 h-[400px] overflow-y-auto scrollbar-hide">
				{notifications.map((notify) => (
					<div
						onClick={() => { handleMarkAsRead(notify.noticeId) }}
						key={notify.noticeId}
						className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative"
					>
						{/* Chấm tròn nếu chưa đọc */}
						{!notify.isRead && (
							<span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span>
						)}

						<img
							className="w-10 h-10 rounded-full object-cover"
							src={notify.urlAvatarSender || "https://i.pravatar.cc/150?img=3"}
							alt="Avatar"
						/>

						<div className="flex-1">
							<div className="flex justify-between items-start">
								<h6 className="text-sm font-medium text-gray-800">
									{notify.firstNameSender} {notify.lastNameSender}
								</h6>
								<span className="text-xs text-gray-400">
									{getTimeAgo(notify.createdAt)}
								</span>
							</div>
							<p className="text-sm text-gray-600 leading-tight mt-0.5">
								{notify.content}
							</p>
						</div>
					</div>
				))}
			</div>
			<div onClick={(e) => e.stopPropagation()}>
				<div className="text-[16px] font-bold p-4">{t("previous")}</div>

				{loading ? (
					<div className="text-center p-4">{t("loading")}...</div>
				) : users.length === 0 ? (
					<div className="text-center p-4">{t("started_following_you")}</div>
				) : (
					users.map((user: any, index) => {
						const senderInfo = user?.data || {
							userId: user?.sender,
							userName: `User ${user?.sender}`,
							urlAvatar: "/default-avatar.jpg"
						};
						console.log("senderInfosenderInfo", senderInfo)

						return (
							<div
								key={index}
								className="cursor-pointer hover-effect flex items-center justify-between gap-3 p-4  border-gray-200"
								onClick={() => navigate(`/profile/${senderInfo.userId}`)}
							>
								<img
									src={senderInfo?.urlAvatar || "/default-avatar.jpg"}
									className="w-10 h-10 rounded-full"
									alt="User Avatar"
								/>
								<div className="flex flex-col">
									<div className="font-medium text-[15px]">
										{senderInfo?.userName} <strong className="font-normal">{t("started_following_you")}</strong>
									</div>
								</div>
								<div className="">
								</div>
							</div>
						);
					})
				)}
			</div>


		</div>
	);
}
