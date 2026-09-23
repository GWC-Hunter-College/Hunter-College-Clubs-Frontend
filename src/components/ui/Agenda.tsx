import type { ReactNode } from "react";
import classes from "./Agenda.module.css";
import { formatDayColumn, formatMonthHeader } from "../../lib/datetime";

export function MonthHeader({ iso, timezone }: { iso: string; timezone?: string }) {
  return <h3 className={`${classes.monthHeader} text-month-italic`}>{formatMonthHeader(iso, timezone)}</h3>;
}

export function SemesterHeader({ label }: { label: string }) {
  return <h3 className={`${classes.monthHeader} text-month-italic`}>{label}</h3>;
}

/** Desktop: 56px date column (weekday over day number) beside the day's rows. */
export function AgendaDay({ iso, timezone, children }: { iso: string; timezone?: string; children: ReactNode }) {
  const { weekday, day } = formatDayColumn(iso, timezone);
  return (
    <div className={classes.day}>
      <div className={classes.dateColumn}>
        <span className="text-meta-mono-caps">{weekday}</span>
        <span className="text-heading-l">{day}</span>
      </div>
      <div className={classes.rows}>{children}</div>
    </div>
  );
}

/** Mobile: day label above the row(s), no date column. */
export function MobileDayGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className={`${classes.mobileDayLabel} text-meta-mono-caps`}>{label}</p>
      <div className={classes.rows}>{children}</div>
    </div>
  );
}
