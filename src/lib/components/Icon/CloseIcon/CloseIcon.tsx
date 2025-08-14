import type { IconCommonProps } from "../Icon.type";

const CloseIcon = ({ size = "3.2rem", fill = "black", ...rest }: IconCommonProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill={fill}
      {...rest}>
      <path d="M256-192.35 192.35-256l224-224-224-224L256-767.65l224 224 224-224L767.65-704l-224 224 224 224L704-192.35l-224-224-224 224Z" />
    </svg>
  );
};

export default CloseIcon;
