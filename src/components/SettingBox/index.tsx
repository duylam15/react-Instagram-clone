import styles from "./SettingBox.module.css";
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../configs/i18n';
import { useTheme } from '../../contexts/ThemeContext';
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
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.box} onClick={(e) => e.stopPropagation()}>
				<div onClick={toggleTheme}>
					{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
				</div>

				<select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
					<option value="en">English</option>
					<option value="vi">Tiếng Việt</option>
				</select>
				<div>
					Logout
				</div>
			</div>
		</div>
	);
}


