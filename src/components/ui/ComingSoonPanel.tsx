import type { ReactNode } from "react";
import classes from "./ComingSoonPanel.module.css";

type ComingSoonPanelProps = {
  icon: ReactNode;
  title: string;
  text: string;
  tone?: "brand" | "surface";
  action?: ReactNode;
};

/** Centered empty/coming-soon state used by Board, Announcements, and other unbuilt tabs. */
export default function ComingSoonPanel({ icon, title, text, tone = "brand", action }: ComingSoonPanelProps) {
  return (
    <div className={classes.panel}>
      <div className={`${classes.icon} ${classes[tone]}`} aria-hidden="true">
        {icon}
      </div>
      <h2 className={`${classes.title} text-heading-l`}>{title}</h2>
      <p className={`${classes.text} text-body-l`}>{text}</p>
      {action}
    </div>
  );
}
