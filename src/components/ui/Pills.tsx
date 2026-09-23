import type { ButtonHTMLAttributes, ReactNode } from "react";
import classes from "./Pills.module.css";

/** Read-only topic chip. Never looks like a button. */
export function ChipTag({ children }: { children: ReactNode }) {
  return <span className={`${classes.tag} text-chip`}>{children}</span>;
}

/** Selectable filter/topic chip (Create Club topics, filters). */
export function ChipFilter({
  selected,
  children,
  ...rest
}: { selected?: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`${classes.filterChip} ${selected ? classes.selected : ""} text-chip`}
      aria-pressed={selected}
      {...rest}
    >
      {children}
    </button>
  );
}

export type EventStatus = "posted" | "draft" | "cancelled" | "past";

const STATUS_LABEL: Record<EventStatus, string> = {
  posted: "Posted",
  draft: "Draft",
  cancelled: "Cancelled",
  past: "Past event",
};

/** Status pill: Posted / Draft / Cancelled / Past. Past omits the leading dot when `plain`. */
export function StatusPill({ status, plain, children }: { status: EventStatus; plain?: boolean; children?: ReactNode }) {
  return (
    <span className={`${classes.statusPill} ${classes[`status-${status}`]} text-meta-mono-caps`}>
      {!plain && <span className={classes.dot} aria-hidden="true" />}
      {children ?? STATUS_LABEL[status].toUpperCase()}
    </span>
  );
}

export function SoonPill() {
  return <span className={`${classes.soonPill} text-meta-mono-caps`}>SOON</span>;
}

export function EboardPill() {
  return <span className={`${classes.eboardPill} text-meta-mono-caps`}>E-BOARD</span>;
}

export function CountPill({ children }: { children: ReactNode }) {
  return <span className={`${classes.countPill} text-meta-mono-caps`}>{children}</span>;
}

export type Role = "member" | "eboard" | "owner";

/** Role label with a leading colored dot: "owner" / "eboard" / "member". */
export function RoleLabel({ role, withDot = true }: { role: Role; withDot?: boolean }) {
  return (
    <span className={`${classes.role} ${classes[`role-${role}`]} text-role`}>
      {withDot && <span className={classes.roleDot} aria-hidden="true" />}
      {role}
    </span>
  );
}

/** Small role-colored dot for the bottom-right corner of a club logo. */
export function RoleDot({ role, size = 11 }: { role: Role; size?: number }) {
  return (
    <span
      className={classes[`role-${role}`]}
      style={{
        display: "block",
        width: size,
        height: size,
        borderRadius: 999,
        background: "currentColor",
        boxShadow: "0 0 0 2px var(--bg-deep)",
      }}
      aria-hidden="true"
    />
  );
}
