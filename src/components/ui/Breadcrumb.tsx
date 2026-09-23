import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./Breadcrumb.module.css";

type BreadcrumbProps = {
  segments: string[];
  /** Where the arrow/whole crumb navigates. Defaults to browser back. */
  to?: string;
};

/** Desktop-only breadcrumb: arrow-left + path segments joined by "  /  ". Detail pages use the mobile top bar instead. */
export default function Breadcrumb({ segments, to }: BreadcrumbProps) {
  const navigate = useNavigate();
  return (
    <button type="button" className={classes.crumb} onClick={() => (to ? navigate(to) : navigate(-1))}>
      <IconArrowLeft size={18} aria-hidden="true" />
      <span className="text-meta-mono-caps">
        {segments.map((segment, i) => (
          <span key={segment + i}>
            {i > 0 && <span className={classes.sep}>&nbsp;&nbsp;/&nbsp;&nbsp;</span>}
            {segment}
          </span>
        ))}
      </span>
    </button>
  );
}
