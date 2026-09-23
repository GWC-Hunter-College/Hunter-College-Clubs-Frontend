import classes from "./PageHeader.module.css";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

/** Section-page header: eyebrow, Display/L (desktop) or Display/M (mobile) title, optional subtitle. */
export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className={classes.header}>
      <p className={`${classes.eyebrow} text-meta-mono-caps`}>{eyebrow}</p>
      <h1 className={`${classes.title} ${classes.responsiveTitle} text-display-l`}>{title}</h1>
      {subtitle && <p className={`${classes.subtitle} text-body-l`}>{subtitle}</p>}
    </header>
  );
}
