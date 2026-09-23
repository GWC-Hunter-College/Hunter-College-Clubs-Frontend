import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import classes from "./Button.module.css";
import iconClasses from "./IconButton.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "l" | "m" | "s";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
};

type ButtonProps = CommonProps &
  (
    | ({ to: string; href?: undefined } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
    | ({ href: string; to?: undefined } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
    | ({ to?: undefined; href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

/** Pill-shaped button in the five redesign variants. Renders a <Link>, <a>, or <button>. */
export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "m", leftIcon, rightIcon, fullWidth, className, children, disabled, ...rest } = props;
  const cls = [classes.btn, classes[variant], classes[`size-${size}`], fullWidth ? classes.fullWidth : "", className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {leftIcon && <span className={classes.icon}>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className={classes.icon}>{rightIcon}</span>}
    </>
  );

  if ("to" in rest && rest.to) {
    const { to, ...anchorRest } = rest as { to: string };
    if (disabled) return <span className={cls} aria-disabled="true">{content}</span>;
    return (
      <Link to={to} className={cls} {...anchorRest}>
        {content}
      </Link>
    );
  }
  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as { href: string };
    if (disabled) return <span className={cls} aria-disabled="true">{content}</span>;
    return (
      <a href={href} className={cls} {...anchorRest}>
        {content}
      </a>
    );
  }
  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonRest.type ?? "button"} className={cls} disabled={disabled} {...buttonRest}>
      {content}
    </button>
  );
}

export type IconButtonVariant = "outline" | "ghost" | "glass" | "filled";
export type IconButtonSize = 44 | 36;

type IconButtonProps = {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: ReactNode;
  "aria-label": string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/** Circular icon-only button (outline / ghost / glass / filled). */
export function IconButton({ variant = "outline", size = 44, icon, className, ...rest }: IconButtonProps) {
  const cls = [iconClasses.btn, iconClasses[variant], iconClasses[`size-${size}`], className].filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} {...rest}>
      {icon}
    </button>
  );
}
