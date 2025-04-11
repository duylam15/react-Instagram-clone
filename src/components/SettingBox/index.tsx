import styles from "./SettingBox.module.css";
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../configs/i18n';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from "react-router-dom";
interface SettingBoxProps {
	onClose: () => void;
}

export default function SettingBox({ onClose }: SettingBoxProps) {

	const { theme, toggleTheme } = useTheme();

	const { t, i18n } = useTranslation();

	// Hàm đổi ngôn ngữ
	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};
	const navigate = useNavigate()
	const handleLogout = () => {
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
		navigate('/login'); // hoặc window.location.href = '/login';
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.box} onClick={(e) => e.stopPropagation()}>
				<div onClick={toggleTheme}>
					{theme === 'light' ? 'Dark Mode' : 'Light Mode'}
				</div>

				<select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
					<option value="en">English</option>
					<option value="vi">Tiếng Việt</option>
				</select>

				<div onClick={handleLogout}>
					Logout
				</div>
			</div>
		</div>
	);
}


