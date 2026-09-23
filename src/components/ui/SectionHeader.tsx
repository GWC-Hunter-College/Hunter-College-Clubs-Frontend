import type { ReactNode } from "react";
import classes from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  countPill?: ReactNode;
};

/** Row header used inside a page: eyebrow + Heading/L title (+ count pill) versus a right-aligned action. */
export default function SectionHeader({ eyebrow, title, action, countPill }: SectionHeaderProps) {
  return (
    <div className={classes.row}>
      <div className={classes.left}>
        {eyebrow && <p className={`${classes.eyebrow} text-meta-mono-caps`}>{eyebrow}</p>}
        <h2 className={`${classes.title} text-heading-l`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {title}
          {countPill}
        </h2>
      </div>
      {action}
    </div>
  );
}
