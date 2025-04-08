import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getListInviteReceived } from "../../services/friend/friend";
import { getUserById } from "../../services/user/user";
import { useNavigate } from "react-router-dom";
import './notifyCardHover.css'

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

export default function Notifications() {
	const { t } = useTranslation();
	const [invites, setInvites] = useState<Invite[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const userId: any = localStorage.getItem('userId');

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

	console.log("usersusersusers", users)
	console.log("invitesinvitesinvites", invites)

	return (
		<div className="w-[400px] relative" onClick={(e) => e.stopPropagation()}>
			<div className="text-[24px] font-bold mt-3 p-4">{t("notifications")}</div>
			<div className="list-notify mt-4 h-[400px] overflow-y-auto scrollbar-hide">
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					<span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span>

					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					<span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span>

					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					<span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span>

					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					<span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span>

					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					<span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span>

					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					{/* <span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span> */}

					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					{/* <span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span> */}
					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
				<div className="notification-card mt-1 px-3 py-1 max-w-md mx-auto bg-white hover:!bg-gray-100 cursor-pointer transition-colors duration-150 rounded-md flex items-start space-x-3 relative">
					<span className="absolute right-2 top-6 w-2.5 h-2.5 rounded-full bg-green-500"></span>

					<img
						className="w-10 h-10 rounded-full object-cover"
						src="https://i.pravatar.cc/150?img=3"
						alt="Avatar"
					/>
					<div className="flex-1">
						<div className="flex justify-between items-start">
							<h6 className="text-sm font-medium text-gray-800">Thông báo mới</h6>
							<span className="text-xs text-gray-400">5 phút trước</span>
						</div>
						<p className="text-sm text-gray-600 leading-tight mt-0.5">
							Bạn có một tin nhắn mới từ hệ thống. Vui lòng kiểm tra hộp thư của bạn.
						</p>
					</div>
				</div>
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
