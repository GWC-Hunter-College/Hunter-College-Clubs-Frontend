import { Box, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import BackButton from "./BackButton";
import User from "./User";
import type { AuthInfo } from "../../types/auth";

// BackButton opts for later
type BackConfig = {
  to?: string;
  onClick?: () => void;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
};

type PageHeaderProps = {
  pageTitle: string;
  back?: BackConfig | boolean;                    // true = show default BackButton
  user?: { auth: AuthInfo; title?: string };     // pass unified auth object
  className?: string;

  titleSize?: "lg" | "md" | "sm";
  titleTone?: "default" | "muted";
};

export default function PageHeader({
  pageTitle,
  back = true,
  user,
  className,
  titleSize = "lg",
  titleTone = "default",
}: PageHeaderProps) {
  const theme = useMantineTheme();
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const showBack = Boolean(back);
  const backProps = typeof back === "object" ? back : {};

  const sizeMap: Record<"lg" | "md" | "sm", string> = {
    lg: "clamp(24px, 4vw, 48px)",   // default
    md: "clamp(20px, 3.2vw, 36px)",
    sm: "clamp(18px, 2.6vw, 28px)",
  };

  const color = titleTone === "muted" ? "rgba(255, 255, 255, 0.65)" : undefined;

  return (
    <Box
      className={className}
      style={{
        display: "grid",
        // Back | Title (flexible) | User
        gridTemplateColumns: isXs ? "auto 1fr" : "auto minmax(0,1fr) auto",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
      }}
    >
      {/* Back button (col 1) */}
      {showBack && <BackButton {...backProps} />}

      {/* Title (col 2) */}
      <Title
        order={1}
        style={{
          minWidth: 0,                        
          fontSize: sizeMap[titleSize],
          lineHeight: 1,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color,
        }}
        title={pageTitle}
      >
        {pageTitle}
      </Title>

      {/* User (col 3 on wide; new row, right-aligned on xs) */}
      {user && (
        <Box
          style={{
            justifySelf: "end",
            ...(isXs ? { gridColumn: "1 / -1", marginTop: 8 } : null),
          }}
        >
          <User auth={user.auth} title={user.title} />
        </Box>
      )}
    </Box>
  );
}
