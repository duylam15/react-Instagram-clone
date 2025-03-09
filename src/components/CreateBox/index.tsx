import { useTranslation } from "react-i18next";
import styles from "./CreateBox.module.css";

interface CreateBoxProps {
	onClose: () => void;
}

export default function CreateBox({ onClose }: CreateBoxProps) {
	const { t } = useTranslation();
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.box} onClick={(e) => e.stopPropagation()}>
				<h2>Tạo bài viết</h2>
				<p>Nội dung của Creates Box...</p>
				<button onClick={onClose}>Đóng</button>
			</div>
		</div>
	);
}
