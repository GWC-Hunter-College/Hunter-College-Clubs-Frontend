import { Link } from "react-router-dom";
import { IconArrowLeft, IconShare3 } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./MobileTopBar.module.css";
import { IconButton } from "../ui/Button";
import UserMenu from "./UserMenu";
import { useShellState } from "./useShell";
import { useAuthInfo } from "../../types/auth";

export default function MobileTopBar() {
  const { mobileHeader } = useShellState();
  const auth = useAuthInfo();
  const navigate = useNavigate();

  if (mobileHeader.mode === "detail") {
    const { title, backTo, onShare } = mobileHeader;
    return (
      <div className={classes.bar}>
        <IconButton
          variant="ghost"
          size={44}
          icon={<IconArrowLeft size={22} />}
          aria-label="Go back"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        />
        <h1 className={`${classes.detailTitle} text-body-m-strong`}>{title}</h1>
        {onShare ? (
          <IconButton variant="ghost" size={44} icon={<IconShare3 size={22} />} aria-label="Share" onClick={onShare} />
        ) : (
          <span style={{ width: 44 }} />
        )}
      </div>
    );
  }

  return (
    <div className={classes.bar}>
      <Link to="/" className={`${classes.wordmark} text-wordmark`}>
        HUNTER <span>CS</span>
      </Link>
      <UserMenu auth={auth} />
    </div>
  );
}
