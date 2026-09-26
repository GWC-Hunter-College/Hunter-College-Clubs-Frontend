import type { ReactNode } from "react";
import classes from "./StatCard.module.css";

type StatCardProps = {
  icon: ReactNode;
  number: number;
  label: string;
  mobile?: boolean;
};

export default function StatCard({ icon, number, label, mobile }: StatCardProps) {
  if (mobile) {
    return (
      <div className={classes.mobileCard}>
        <span className="text-heading-l" style={{ color: "var(--text-primary)" }}>
          {number}
        </span>
        <span className="text-caption" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
      </div>
    );
  }
  return (
    <div className={classes.card}>
      <div className={classes.icon} aria-hidden="true">
        {icon}
      </div>
      <span className={`${classes.number} text-display-m`}>{number}</span>
      <span className={`${classes.label} text-caption`}>{label}</span>
    </div>
  );
}
