import { IconCalendarEvent } from "@tabler/icons-react";
import classes from "./MyClubCard.module.css";
import ClubLogo from "./ClubLogo";
import Button from "./Button";
import { RoleLabel, type Role } from "./Pills";
import type { Club } from "../../types/club";

type MyClubCardProps = {
  club: Club;
  role: Role;
  nextEventLabel?: string;
  mobile?: boolean;
};

const canManage = (role: Role) => role === "eboard" || role === "owner";

export default function MyClubCard({ club, role, nextEventLabel, mobile }: MyClubCardProps) {
  if (mobile) {
    return (
      <div className={classes.mobileCard}>
        <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={48} role={role} />
        <span className="text-body-m-strong" style={{ color: "var(--text-primary)" }}>
          {club.name}
        </span>
        <RoleLabel role={role} />
        <Button
          to={canManage(role) ? `/club/${club.id}/event/new` : `/club/${club.id}`}
          variant={canManage(role) ? "outline" : "ghost"}
          size="m"
          fullWidth
        >
          {canManage(role) ? "+ NEW EVENT" : "OPEN CLUB →"}
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={56} role={role} />
        <div className={classes.headerText}>
          <h3 className={`${classes.name} text-heading-m`}>{club.name}</h3>
          <RoleLabel role={role} />
        </div>
      </div>
      <hr className={classes.rule} />
      <div className={`${classes.next} text-meta-mono-caps`}>
        <IconCalendarEvent size={18} aria-hidden="true" style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
        <span>{nextEventLabel ? `NEXT · ${nextEventLabel}` : "No upcoming events"}</span>
      </div>
      <div className={classes.actions}>
        {canManage(role) && (
          <Button to={`/club/${club.id}/event/new`} variant="outline" size="s">
            + NEW EVENT
          </Button>
        )}
        <Button to={`/club/${club.id}`} variant="ghost" size="s">
          OPEN CLUB &rarr;
        </Button>
      </div>
    </div>
  );
}
