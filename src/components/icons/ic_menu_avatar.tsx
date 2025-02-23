export const MenuAvatar = ({
  url,
  size = 24,
  isActive,
}: {
  url: string;
  size?: number;
  isActive: boolean;
}): JSX.Element => {
  return (
    <img
      src={url}
      style={{
        width: `${size}px`, height: `${size}px`, transform: "translateX(3px)"
        , border: isActive ? '2px solid #000' : 'none'
      }}
      className="rounded-full"
      alt=""
    />
  );
};
