import type { PropsWithChildren } from "react";
import classes from "./PageContainer.module.css";

type PageContainerProps = PropsWithChildren<{
  /** Detail pages (club, event, create forms) get 32px desktop top padding instead of 40px. */
  detail?: boolean;
  className?: string;
}>;

/** Centered content column: max-width 1248px, 48px desktop / 16px mobile gutters. */
export default function PageContainer({ detail, className, children }: PageContainerProps) {
  return <div className={`${classes.container} ${detail ? classes.detail : ""} ${className ?? ""}`}>{children}</div>;
}
