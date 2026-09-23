import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import classes from "./ManagerBar.module.css";
import Button from "../ui/Button";

type ManagerBarProps = {
  clubName: string;
  isOwner: boolean;
  upcoming: boolean;
  mobile?: boolean;
};

/** Neither edit nor cancel has a backend endpoint yet; both surface the same "not available" notice. */
export default function ManagerBar({ clubName, isOwner, upcoming, mobile }: ManagerBarProps) {
  const [notice, setNotice] = useState(false);

  if (mobile) {
    return (
      <div>
        <div className={classes.bar}>
          <span className={`${classes.label} text-meta-mono-caps`}>YOU MANAGE THIS EVENT</span>
          <Button variant="outline" size="s" onClick={() => setNotice(true)}>
            EDIT
          </Button>
        </div>
        {notice && <Notice />}
      </div>
    );
  }

  return (
    <div>
      <div className={classes.bar}>
        <span className={`${classes.label} text-meta-mono-caps`}>
          <span className={classes.dot} aria-hidden="true" />
          {isOwner ? `YOU OWN ${clubName.toUpperCase()}` : `YOU’RE ON THE E-BOARD OF ${clubName.toUpperCase()}`}
        </span>
        <span className={classes.actions}>
          <Button variant="outline" size="s" onClick={() => setNotice(true)}>
            EDIT EVENT
          </Button>
          {upcoming && (
            <Button variant="danger" size="s" onClick={() => setNotice(true)}>
              CANCEL EVENT
            </Button>
          )}
        </span>
      </div>
      {notice && <Notice />}
    </div>
  );
}

function Notice() {
  return (
    <div className={`${classes.notice} text-caption`}>
      <IconAlertTriangle size={16} aria-hidden="true" />
      This feature isn&rsquo;t available yet.
    </div>
  );
}
