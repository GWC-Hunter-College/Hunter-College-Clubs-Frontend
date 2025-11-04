import { ActionIcon } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  to?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg"; // overall circle size
  ariaLabel?: string;
};

const ArrowLeft = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    role="img"
    aria-hidden="true"
  >
    {/* chevron */}
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* stem */}
    <path
      d="M19 12H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function BackButton({
  to,
  onClick,
  size = "lg",
  ariaLabel = "Go back",
}: BackButtonProps) {
  const navigate = useNavigate();
  const handle = () => {
    onClick?.();
    to ? navigate(to) : navigate("/");
  };

  const btnPx = size === "sm" ? 40 : size === "md" ? 48 : 56; // circle diameter
  const iconPx = size === "sm" ? 18 : size === "md" ? 20 : 22;

  return (
    <ActionIcon
      onClick={handle}
      size={btnPx}
      radius={999}
      aria-label={ariaLabel}
      title={ariaLabel}
      // make a solid/gradient purple circle with white icon
      style={{
        background: "linear-gradient(135deg, #B084F9 0%, #7C3AED 100%)",
        color: "#fff",
        boxShadow: "0 6px 18px rgba(124, 58, 237, 0.35)",
      }}
    >
      <ArrowLeft size={iconPx} />
    </ActionIcon>
  );
}
