import { useRef, useState } from "react";
import { IconCalendarEvent, IconBell, IconSettings, IconLayoutGrid } from "@tabler/icons-react";
import classes from "./Tabs.module.css";
import { EboardPill, SoonPill } from "../ui/Pills";

export type ClubTab = "events" | "board" | "announcements" | "manage";

const TAB_META: Record<ClubTab, { label: string; icon: (size: number) => React.ReactNode; tooltip: string }> = {
  events: { label: "EVENTS", icon: (s) => <IconCalendarEvent size={s} />, tooltip: "EVENTS" },
  board: { label: "BOARD", icon: (s) => <IconLayoutGrid size={s} />, tooltip: "BOARD · SOON" },
  announcements: { label: "ANNOUNCEMENTS", icon: (s) => <IconBell size={s} />, tooltip: "ANNOUNCEMENTS · SOON" },
  manage: { label: "MANAGE", icon: (s) => <IconSettings size={s} />, tooltip: "MANAGE" },
};

type TabsProps = {
  active: ClubTab;
  onChange: (tab: ClubTab) => void;
  showManage: boolean;
  mobile?: boolean;
};

export default function Tabs({ active, onChange, showManage, mobile }: TabsProps) {
  const tabs: ClubTab[] = showManage ? ["events", "board", "announcements", "manage"] : ["events", "board", "announcements"];

  if (mobile) {
    return (
      <div className={classes.mobileRow} role="tablist">
        {tabs.map((tab) => (
          <MobileTab key={tab} tab={tab} active={active === tab} onClick={() => onChange(tab)} />
        ))}
      </div>
    );
  }

  return (
    <div className={classes.row} role="tablist">
      {tabs.map((tab) => {
        const meta = TAB_META[tab];
        const isSoon = tab === "board" || tab === "announcements";
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            className={`${classes.tab} ${active === tab ? classes.active : ""} text-meta-mono-caps`}
            onClick={() => onChange(tab)}
          >
            {meta.icon(16)}
            <span className={classes.label}>{meta.label}</span>
            {isSoon && <SoonPill />}
            {tab === "manage" && <EboardPill />}
          </button>
        );
      })}
    </div>
  );
}

function MobileTab({ tab, active, onClick }: { tab: ClubTab; active: boolean; onClick: () => void }) {
  const meta = TAB_META[tab];
  const [showTip, setShowTip] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    timer.current = setTimeout(() => setShowTip(true), 450);
  };
  const end = () => {
    if (timer.current) clearTimeout(timer.current);
    setTimeout(() => setShowTip(false), 900);
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={meta.label}
      className={`${classes.mobileTab} ${active ? classes.active : ""}`}
      onClick={onClick}
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={end}
    >
      {meta.icon(24)}
      {showTip && <span className={`${classes.tooltip} text-meta-mono-caps`}>{meta.tooltip}</span>}
    </button>
  );
}
