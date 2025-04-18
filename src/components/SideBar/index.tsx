// React hooks
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// React Router
import { useNavigate, useLocation } from "react-router-dom";

// i18n
import { useTranslation } from "react-i18next";

// Context
import { useTheme } from "../../contexts/ThemeContext";

// Components
import Search from "../search/Search";
import Notifications from "../Notifications";
import CreateBox from "../CreateBox";
import SettingBox from "../SettingBox";
import NavItem from "../../components/nav_item";

// Icons
import {
	IconCreate,
	IconCreateActive,
	IconExplore,
	IconExploreActive,
	IconHome,
	IconHomeActive,
	IconMessages,
	IconMessagesActive,
	IconNofication,
	IconNoficationActive,
	IconSearch,
	IconSearchActive,
} from "../../components/icons";
import { IconInstagramLogo } from "../../components/icons/ic_instagram_logo";
import { MenuAvatar } from "../icons/ic_menu_avatar";
import { IconMore } from "../icons/ic_more";
import { InstagramLogo } from "../icons/ic_Instagram_logo_text";

// Styles
import styles from "./styles.module.css";
import { useNotificationSocket } from "../../contexts/NotificationSocketContext";
import { getListNotifyByIdReceiver, getListNotifyUnReadByIdReceiver } from "../../services/notity";


export default function SideBar(): JSX.Element {
	// Lấy navigate, location và path từ React Router
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname.replace("/", "");

	// State kiểm soát giao diện
	const [sidebarWidth, setSidebarWidth] = useState(location.pathname === "/messages" ? "90px" : "200px");
	const [showSearch, setShowSearch] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showBox, setShowBox] = useState(false);
	const [showSettingBox, setShowSettingBox] = useState(false);

	// Lấy giá trị theme từ context
	const { theme } = useTheme();

	// Lấy hàm dịch `t` từ i18n
	const { t } = useTranslation();

	useEffect(() => {
		if (location.pathname.startsWith("/profile")) {
			setShowSearch(false);
			setShowNotifications(false);
		}
	}, [location.pathname]); // Chạy mỗi khi đường dẫn thay đổi

	// Điều chỉnh sidebar khi vào trang Messages
	useEffect(() => {
		setSidebarWidth(location.pathname === "/messages" ? "90px" : "200px");
		setShowSearch(false);
	}, [location.pathname]);

	// Xử lý điều hướng và cập nhật giao diện
	const handleClickNavigate = (tab: string) => {
		navigate(`/${tab}`);
		setSidebarWidth(tab === "messages" ? "90px" : "200px");
		setShowSearch(false);
		setShowNotifications(false);
	};

	// Xử lý mở/đóng Search & Notifications
	const handleClickModal = (tab: string) => {
		const toggleState = (state: boolean, setState: Function, setState2: Function) => {
			setState(!state);
			setState2(false)
			setSidebarWidth(!state || location.pathname === "/messages" ? "90px" : "200px");
		};

		tab === "search" && toggleState(showSearch, setShowSearch, setShowNotifications);
		tab === "notifications" && toggleState(showNotifications, setShowNotifications, setShowSearch);
	};

	// Xử lý hiển thị CreateBox & SettingBox
	const handleClickBox = (tab: string) => {
		setShowBox(tab === "creates");
		setShowSettingBox(tab === "more");
	};

	const iconColor = theme === "dark" ? "white" : "black";
	const [unRead, setUnRead] = useState(false);

	const { notificationsWebsocket } = useNotificationSocket();
	const unreadCount = notificationsWebsocket.filter((n) => !n.object.isRead).length;


	useEffect(() => {
		setUnRead(unreadCount > 0);
	}, [notificationsWebsocket]);


	useEffect(() => {
		async function fetchNotifications() {
			try {
				const userId = localStorage.getItem("userId");
				if (!userId) return;
				const response = await getListNotifyUnReadByIdReceiver(0, 99, Number(userId));
				console.log("response thong bao sidbar", response)
				if (response.statusCode == 200 && response.data.totalElements == 0) {
					console.log("khong co thong bao chua doc 11111111")
					setUnRead(false);
				} else {
					console.log("co thong bao chua doc 11111111")
					setUnRead(true);
				}
			} catch (error) {
				console.error("Lỗi khi lấy danh sách thông báo:", error);
			}
		}
		fetchNotifications();
	}, []);

	
	console.log("Unread notifications count:", unreadCount);
	return (
		<div className={styles.sidebar} style={{ width: sidebarWidth, transition: "width 0.3s ease" }}>
			<div className="logo">
				<div className={`${styles.show_logo} `}>
					{sidebarWidth === "90px" ? <IconInstagramLogo color={iconColor} />
						: <InstagramLogo color={iconColor} />}
				</div>
			</div>
			<div className={`${styles.show_icon_logo} `}>
				<IconInstagramLogo color={iconColor} />
			</div>
			<div className={`${styles.navbar} `}>
				<NavItem
					icon={<IconHome color={iconColor} />}
					activeIcon={<IconHomeActive color={iconColor} />}
					title={sidebarWidth === "90px" ? "" : t('home')}
					isActive={path === ""}
					onClick={() => handleClickNavigate("")}
				/>
				<div className={`${styles.hide_on_mobile}`}>
					<NavItem
						icon={<IconSearch color={iconColor} />}
						activeIcon={<IconSearchActive color={iconColor} />}
						title={sidebarWidth === "90px" ? "" : t('search')}
						isActive={location.pathname === "/search"}
						onClick={() => handleClickModal("search")}
					/>
				</div>
				<NavItem
					icon={<IconExplore color={iconColor} />}
					activeIcon={<IconExploreActive color={iconColor} />}
					isActive={path === "explore"}
					title={sidebarWidth === "90px" ? "" : t("explore")}
					onClick={() => handleClickNavigate("explore")}
				/>
				<NavItem
					icon={<IconMessages color={iconColor} />}
					activeIcon={<IconMessagesActive color={iconColor} />}
					isActive={path === "messages"}
					title={sidebarWidth === "90px" ? "" : t("messages")}
					onClick={() => handleClickNavigate("messages")}
				/>

				<div className={`${styles.hide_on_mobile}`}>
					<NavItem
						icon={
							<motion.div
								animate={
									unRead
										? {
											scale: [1, 1.2, 1],
											rotate: [0, 10, -10, 0],
										}
										: {}
								}
								transition={{
									repeat: unRead ? Infinity : 0,
									repeatType: "loop",
									duration: 0.6,
									ease: "easeInOut",
								}}
								style={{ position: "relative", display: "inline-block" }}
							>
								<IconNofication color={iconColor} />
								{unRead && (
									<span
										style={{
											position: "absolute",
											top: -2,
											right: -2,
											width: 8,
											height: 8,
											borderRadius: "50%",
											backgroundColor: "red",
										}}
									></span>
								)}
							</motion.div>
						}
						activeIcon={<IconNoficationActive color={iconColor} />}
						isActive={path === "notifications"}
						title={sidebarWidth === "90px" ? "" : t("notifications")}
						onClick={() => handleClickModal("notifications")}
					/>
				</div>

				<NavItem
					icon={<IconCreate color={iconColor} />}
					activeIcon={<IconCreateActive color={iconColor} />}
					isActive={path === "creates"}
					title={sidebarWidth === "90px" ? "" : t('create')}
					onClick={() => handleClickBox("creates")}
				/>
				<NavItem
					icon={<MenuAvatar url={"https://i.pravatar.cc/300"} isActive={false} />}
					activeIcon={<MenuAvatar url={"https://i.pravatar.cc/300"} isActive={true} />}
					isActive={path === "profile"}
					title={sidebarWidth === "90px" ? "" : t("profile")}
					onClick={() => handleClickNavigate("profile")}
				/>
				<NavItem
					icon={<IconMore color={iconColor} />}
					activeIcon={<IconMore color={iconColor} />}
					isActive={path === "more"}
					title={sidebarWidth === "90px" ? "" : t("more")}
					onClick={() => handleClickBox("more")}
				/>
			</div>


			<div className={`${styles.searchContainer} ${showSearch ? styles.slide : ''}`}>
				{showSearch && <Search />}
			</div>

			<div className={`${styles.searchContainer} ${showNotifications ? styles.slide : ''}`}>
				{showNotifications && <Notifications />}
			</div>

			{showBox && <CreateBox onClose={() => setShowBox(false)} />}

			{showSettingBox && <SettingBox onClose={() => setShowSettingBox(false)} />}

		</div>
	);
}
