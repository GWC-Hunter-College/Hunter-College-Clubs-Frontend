import { cloneElement, useState } from "react";
import type { ReactElement } from "react";
import { Popover } from "@mantine/core";
import { IconLink, IconMail, IconCalendarPlus, IconDotsVertical } from "@tabler/icons-react";
import classes from "./SharePopover.module.css";
import Button from "../ui/Button";
import { canNativeShare, copyToClipboard, nativeShare, buildMailto } from "../../lib/share";
import { downloadIcs } from "../../lib/ics";
import type { Event } from "../../types/events";

type SharePopoverProps = {
  event: Event;
  /** Bypasses the popover for a direct native-share sheet when the platform supports it. */
  mobile?: boolean;
  children: ReactElement<{ onClick?: () => void }>;
};

export default function SharePopover({ event, mobile, children }: SharePopoverProps) {
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/event/${event.id}`;

  const handleTriggerClick = () => {
    if (mobile && canNativeShare()) {
      void nativeShare({ title: event.title, url });
      return;
    }
    setOpened((v) => !v);
  };

  const copy = async () => {
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover opened={opened} onChange={setOpened} width={400} position="bottom-end" withinPortal shadow="md">
      <Popover.Target>{cloneElement(children, { onClick: handleTriggerClick })}</Popover.Target>
      <Popover.Dropdown className={classes.dropdown}>
        <p className={`${classes.eyebrow} text-meta-mono-caps`}>SHARE THIS EVENT</p>
        <div className={classes.linkField}>
          <span className={`${classes.linkText} text-meta-mono`}>{url}</span>
          <Button variant="primary" size="s" onClick={copy}>
            {copied ? "COPIED" : "COPY"}
          </Button>
        </div>
        <div className={classes.rows}>
          <button type="button" className={`${classes.row} text-body-m-strong`} onClick={copy}>
            <IconLink size={20} aria-hidden="true" />
            Copy link
          </button>
          <a
            className={`${classes.row} text-body-m-strong`}
            href={buildMailto(event.title, [event.title, formatMailtoDate(event), url])}
          >
            <IconMail size={20} aria-hidden="true" />
            Email a friend
          </a>
          <button
            type="button"
            className={`${classes.row} text-body-m-strong`}
            onClick={() => downloadIcs(event, url)}
          >
            <IconCalendarPlus size={20} aria-hidden="true" />
            Add to calendar (.ics)
          </button>
          {canNativeShare() && (
            <button
              type="button"
              className={`${classes.row} text-body-m-strong`}
              onClick={() => void nativeShare({ title: event.title, url })}
            >
              <IconDotsVertical size={20} aria-hidden="true" />
              More options&hellip;
            </button>
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

function formatMailtoDate(event: Event) {
  return new Date(event.start).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
}
