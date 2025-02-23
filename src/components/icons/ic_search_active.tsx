export const IconSearchActive = ({ color }: { color: string }): JSX.Element => {
  return (
    <svg
      aria-label="Search"
      color={color}
      fill={color}
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24" style={{ transform: "translateX(3px)" }}
    >
      <path
        d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      ></path>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        x1="16.511"
        x2="21.643"
        y1="16.511"
        y2="21.643"
      ></line>
    </svg>
  );
};
