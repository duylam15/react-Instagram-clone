// React hooks
import { useEffect, useState } from "react";

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


export default function SideBar(): JSX.Element {
	// Lấy navigate, location và path từ React Router
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname.replace("/", "");

	// State kiểm soát giao diện
	const [sidebarWidth, setSidebarWidth] = useState(location.pathname === "/messages" ? "50px" : "200px");
	const [showSearch, setShowSearch] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showBox, setShowBox] = useState(false);
	const [showSettingBox, setShowSettingBox] = useState(false);

	// Lấy giá trị theme từ context
	const { theme } = useTheme();

	// Lấy hàm dịch `t` từ i18n
	const { t } = useTranslation();

	// Điều chỉnh sidebar khi vào trang Messages
	useEffect(() => {
		setSidebarWidth(location.pathname === "/messages" ? "50px" : "200px");
		setShowSearch(false);
	}, [location.pathname]);

	// Xử lý điều hướng và cập nhật giao diện
	const handleClickNavigate = (tab: string) => {
		navigate(`/${tab}`);
		setSidebarWidth(tab === "messages" ? "50px" : "200px");
		setShowSearch(false);
		setShowNotifications(false);
	};

	// Xử lý mở/đóng Search & Notifications
	const handleClickModal = (tab: string) => {
		const toggleState = (state: boolean, setState: Function) => {
			setState(!state);
			setSidebarWidth(!state || location.pathname === "/messages" ? "50px" : "200px");
		};

		tab === "search" && toggleState(showSearch, setShowSearch);
		tab === "notifications" && toggleState(showNotifications, setShowNotifications);
	};

	// Xử lý hiển thị CreateBox & SettingBox
	const handleClickBox = (tab: string) => {
		setShowBox(tab === "creates");
		setShowSettingBox(tab === "more");
	};

	const iconColor = theme === "dark" ? "white" : "black";

	return (
		<div className={styles.sidebar} style={{ width: sidebarWidth, transition: "width 0.3s ease" }}>
			<div className="logo">
				<div className={`${styles.show_logo} `}>
					{sidebarWidth === "50px" ? <IconInstagramLogo color={iconColor} />
						: <InstagramLogo color={iconColor} />}
				</div>
			</div>
			<div className={`${styles.show_icon_logo} `}>
				<IconInstagramLogo color={iconColor} />
			</div>
			<div className={`${styles.navbar} grow`}>
				<NavItem
					icon={<IconHome color={iconColor} />}
					activeIcon={<IconHomeActive color={iconColor} />}
					title={sidebarWidth === "50px" ? "" : t('home')}
					isActive={path === ""}
					onClick={() => handleClickNavigate("")}
				/>
				<div className={`${styles.hide_on_mobile}`}>
					<NavItem
						icon={<IconSearch color={iconColor} />}
						activeIcon={<IconSearchActive color={iconColor} />}
						title={sidebarWidth === "50px" ? "" : t('search')}
						isActive={location.pathname === "/search"}
						onClick={() => handleClickModal("search")}
					/>
				</div>
				<NavItem
					icon={<IconExplore color={iconColor} />}
					activeIcon={<IconExploreActive color={iconColor} />}
					isActive={path === "explore"}
					title={sidebarWidth === "50px" ? "" : t("explore")}
					onClick={() => handleClickNavigate("explore")}
				/>
				<NavItem
					icon={<IconMessages color={iconColor} />}
					activeIcon={<IconMessagesActive color={iconColor} />}
					isActive={path === "messages"}
					title={sidebarWidth === "50px" ? "" : t("messages")}
					onClick={() => handleClickNavigate("messages")}
				/>

				<div className={`${styles.hide_on_mobile}`}>
					<NavItem
						icon={<IconNofication color={iconColor} />}
						activeIcon={<IconNoficationActive color={iconColor} />}
						isActive={path === "notifications"}
						title={sidebarWidth === "50px" ? "" : t("notifications")}
						onClick={() => handleClickModal("notifications")}
					/>
				</div>
				<NavItem
					icon={<IconCreate color={iconColor} />}
					activeIcon={<IconCreateActive color={iconColor} />}
					isActive={path === "creates"}
					title={sidebarWidth === "50px" ? "" : t('create')}
					onClick={() => handleClickBox("creates")}
				/>
				<NavItem
					icon={<MenuAvatar url={"https://i.pravatar.cc/300"} isActive={false} />}
					activeIcon={<MenuAvatar url={"https://i.pravatar.cc/300"} isActive={true} />}
					isActive={path === "profile"}
					title={sidebarWidth === "50px" ? "" : t("profile")}
					onClick={() => handleClickNavigate("profile")}
				/>
				<NavItem
					icon={<IconMore color={iconColor} />}
					activeIcon={<IconMore color={iconColor} />}
					isActive={path === "more"}
					title={sidebarWidth === "50px" ? "" : t("more")}
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
