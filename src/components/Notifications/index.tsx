import React, { useEffect, useState } from "react";
import styles from "./SettingBox.module.css";
import { useTranslation } from "react-i18next";
import { getListInviteReceived } from "../../services/friend/friend";
import { getUserById } from "../../services/user/user";
import { useNavigate } from "react-router-dom";

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
	const userId = 1; // Giả sử ID người dùng là 1, có thể lấy từ context hoặc Redux
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
		<div className="w-[400px] relative">
			<div onClick={(e) => e.stopPropagation()}>
				<div className="text-[24px] font-bold mt-3 p-4">{t("notifications")}</div>
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
