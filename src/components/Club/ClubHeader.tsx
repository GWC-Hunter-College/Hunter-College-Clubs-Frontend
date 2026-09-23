import { useState } from "react";
import { Menu } from "@mantine/core";
import { IconCheck, IconChevronDown, IconBell, IconShare3, IconLogout } from "@tabler/icons-react";
import classes from "./ClubHeader.module.css";
import ClubLogo from "../ui/ClubLogo";
import Button from "../ui/Button";
import { ChipTag, RoleLabel, SoonPill, type Role } from "../ui/Pills";
import type { Club } from "../../types/club";

type ClubHeaderProps = {
  club: Club;
  role: Role | null;
  signedIn: boolean;
  canManage: boolean;
  upcomingCount: number;
  pastCount: number;
  mobile?: boolean;
  onJoin: () => void;
  onShare: () => void;
  onLeaveRequest: () => void;
  onNewEvent: () => void;
};

export default function ClubHeader({
  club,
  role,
  signedIn,
  canManage,
  upcomingCount,
  pastCount,
  mobile,
  onJoin,
  onShare,
  onLeaveRequest,
  onNewEvent,
}: ClubHeaderProps) {
  const isMember = Boolean(role);
  const [menuOpen, setMenuOpen] = useState(false);

  const membershipControl = isMember ? (
    <Menu withinPortal position="bottom-start" opened={menuOpen} onChange={setMenuOpen}>
      <Menu.Target>
        <button type="button" className={`${classes.joinedTrigger} text-button-m`} data-open={menuOpen}>
          <IconCheck size={16} aria-hidden="true" />
          JOINED
          <IconChevronDown size={16} aria-hidden="true" />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconBell size={18} />} rightSection={<SoonPill />} disabled>
          Event reminders
        </Menu.Item>
        <Menu.Item leftSection={<IconShare3 size={18} />} onClick={onShare}>
          Share club
        </Menu.Item>
        {role !== "owner" && (
          <>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconLogout size={18} color="var(--state-danger-soft)" />}
              c="var(--state-danger-soft)"
              onClick={onLeaveRequest}
            >
              Leave club
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  ) : (
    <Button variant="primary" size="s" onClick={onJoin}>
      + JOIN CLUB
    </Button>
  );

  if (mobile) {
    return (
      <div className={classes.mobileHeader}>
        <div className={classes.mobileTopRow}>
          <div className={classes.mobileLogoBlock}>
            <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={82} />
          </div>
          <div className={classes.mobileStats}>
            <Stat number={upcomingCount} label="UPCOMING" />
            <Stat number={pastCount} label="PAST" />
            {typeof club.memberCount === "number" && <Stat number={club.memberCount} label="MEMBERS" />}
          </div>
        </div>
        <div className={classes.mobileNameRow}>
          <span className="text-body-m-strong" style={{ color: "var(--text-primary)" }}>
            {club.name}
          </span>
          {signedIn && role && <RoleLabel role={role} />}
        </div>
        <p className={`${classes.bio} text-body-m`}>{club.description}</p>
        {club.tags.length > 0 && (
          <div className={classes.tags}>
            {club.tags.map((tag) => (
              <ChipTag key={tag}>{tag}</ChipTag>
            ))}
          </div>
        )}
        <div className={classes.mobileButtons}>
          {membershipControl}
          {canManage && (
            <Button variant="primary" size="m" onClick={onNewEvent}>
              + NEW EVENT
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.header}>
      <div className={classes.logoBlock}>
        <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={136} />
      </div>
      <div className={classes.info}>
        <div className={classes.nameRow}>
          <h1 className={`${classes.name} text-display-m`}>{club.name}</h1>
          {membershipControl}
          {canManage && (
            <Button variant="primary" size="s" onClick={onNewEvent}>
              + NEW EVENT
            </Button>
          )}
        </div>
        <div className={classes.stats}>
          <Stat number={upcomingCount} label="upcoming events" />
          <Stat number={pastCount} label="past events" />
          {typeof club.memberCount === "number" && <Stat number={club.memberCount} label="members" />}
        </div>
        {signedIn && role && <RoleLabel role={role} />}
        <p className={`${classes.bio} text-body-m`}>{club.description}</p>
        {club.tags.length > 0 && (
          <div className={classes.tags}>
            {club.tags.map((tag) => (
              <ChipTag key={tag}>{tag}</ChipTag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: number; label: string }) {
  return (
    <div className={classes.stat}>
      <span className={`${classes.statNumber} text-heading-m`}>{number}</span>
      <span className={`${classes.statLabel} text-body-m`}>{label}</span>
    </div>
  );
}
