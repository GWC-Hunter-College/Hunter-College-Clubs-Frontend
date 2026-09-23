import type { ReactNode } from "react";
import classes from "./OptionCard.module.css";
import Button from "../ui/Button";

type OptionCardProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  buttonLabel: string;
  to: string;
  disabled?: boolean;
  disabledNote?: string;
  mobile?: boolean;
};

export default function OptionCard({ icon, eyebrow, title, body, buttonLabel, to, disabled, disabledNote, mobile }: OptionCardProps) {
  if (mobile) {
    return (
      <div className={classes.mobileCard}>
        <div className={classes.mobileIcon} aria-hidden="true">
          {icon}
        </div>
        <div className={classes.mobileBody}>
          <p className={`${classes.eyebrow} text-meta-mono-caps`}>{eyebrow}</p>
          <h3 className={`${classes.title} text-heading-m`}>{title}</h3>
          <p className={`${classes.body} text-body-m`}>{body}</p>
          <Button to={to} variant="primary" size="m" fullWidth disabled={disabled}>
            {buttonLabel}
          </Button>
          {disabled && disabledNote && <p className={`${classes.disabledNote} text-caption`}>{disabledNote}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.card}>
      <div className={classes.icon} aria-hidden="true">
        {icon}
      </div>
      <p className={`${classes.eyebrow} text-meta-mono-caps`}>{eyebrow}</p>
      <h3 className={`${classes.title} text-heading-l`}>{title}</h3>
      <p className={`${classes.body} text-body-l`}>{body}</p>
      <Button to={to} variant="primary" size="l" disabled={disabled}>
        {buttonLabel}
      </Button>
      {disabled && disabledNote && <p className={`${classes.disabledNote} text-caption`}>{disabledNote}</p>}
    </div>
  );
}
