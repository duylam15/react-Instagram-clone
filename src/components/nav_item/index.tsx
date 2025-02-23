import styles from "./styles.module.css";

export default function NavItem({
  icon,
  activeIcon,
  isActive,
  title,
  onClick,
}: {
  icon: JSX.Element;
  activeIcon: JSX.Element;
  title: string;
  isActive: boolean;
  onClick: () => void;
}): JSX.Element {

  console.log("isActiveisActive", isActive)
  return (
    <div
      className={`${styles.nav_item} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      {isActive ? activeIcon : icon}
      <p className={`${styles.nav_title} text-base pl-4`}>
        {title}
      </p>
    </div>

  );
}
