// src/components/Other/PageShell.tsx
import type { ReactNode, CSSProperties } from "react";
import { Container, Stack, Box } from "@mantine/core";
import PageHeader from "./PageHeader";
import type { AuthInfo } from "../../types/auth";

type BackConfig = {
  to?: string;
  onClick?: () => void;
  ariaLabel?: string;
  size?: "sm" | "md" | "lg";
};

type PageShellProps = {
  children: ReactNode;

  // Header controls
  showHeader?: boolean; // hide on Home
  pageTitle?: string;
  back?: BackConfig | boolean;
  user?: { auth: AuthInfo; title?: string };

  // Layout controls
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" |  "full";
  padded?: boolean;
  contentGap?: number | string;
  centerContent?: boolean;
  
  // Styling hooks
  className?: string;
  style?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  topPadding?: number | string;
};

const sizeMap: Record<
  Exclude<NonNullable<PageShellProps["size"]>, "full">,
  number
> = {
  sm: 640,
  md: 860,
  lg: 1100,
  xl: 1280,
  xxl: 1440,
  xxxl: 1680,
};


export default function PageShell({
  children,
  showHeader = true,
  pageTitle,
  back = true,
  user,
  size = "xl",
  padded = true,
  contentGap = "md",
  centerContent = false,
  className,
  style,
  contentClassName,
  contentStyle,
  topPadding = 24,
}: PageShellProps) {
  return (
    <Container
      // uniform styling for each page
      fluid={size === "full"}
      size={size === "full" ? undefined : sizeMap[size]}
      px={padded ? 16 : 0}
      className={className}
      style={{ paddingTop: topPadding, ...(style || {}) }}
    >
      <Stack gap={contentGap}>
        {showHeader && (pageTitle || back || user) ? (
          // let PageHeader manage its own internal layout   
          <Box>
            <PageHeader pageTitle={pageTitle ?? ""} back={back} user={user} />
          </Box>
        ) : null}

        <Box
          className={contentClassName}
          style={{
            width: "100%",
            ...(centerContent
              ? { display: "flex", flexDirection: "column", alignItems: "center" }
              : null),
            ...contentStyle,
          }}
        >
          {children}
        </Box>
      </Stack>
    </Container>
  );
}
