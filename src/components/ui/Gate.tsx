import type { ReactNode } from "react";
import classes from "./Gate.module.css";
import Button from "./Button";
import { useAuthInfo } from "../../types/auth";

type GateProps = {
  icon: ReactNode;
  title: string;
  pitch: string;
  /** A blurred preview of the page rendered from public data only; never fetch private data for it. */
  preview: ReactNode;
};

/** Signed-out gate: blurred page preview + centered sign-in card. */
export default function Gate({ icon, title, pitch, preview }: GateProps) {
  const auth = useAuthInfo();
  return (
    <div className={classes.wrap}>
      <div className={classes.preview} aria-hidden="true">
        {preview}
      </div>
      <div className={classes.scrim}>
        <div className={classes.card}>
          <div className={classes.icon} aria-hidden="true">
            {icon}
          </div>
          <h2 className={`${classes.title} text-heading-l`}>{title}</h2>
          <p className={`${classes.pitch} text-body-l`}>{pitch}</p>
          <div className={classes.actions}>
            <Button variant="primary" size="l" fullWidth onClick={() => auth.signIn()}>
              SIGN IN
            </Button>
            <Button to="/events" variant="ghost" size="m">
              BROWSE EVENTS INSTEAD
            </Button>
          </div>
          <p className={`${classes.note} text-caption`}>Anyone can browse events and clubs without an account.</p>
        </div>
      </div>
    </div>
  );
}
