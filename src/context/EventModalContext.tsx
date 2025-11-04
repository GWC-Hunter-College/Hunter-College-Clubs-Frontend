import { createContext, useCallback, useContext, useMemo, useState } from "react";
import EventModal from "../components/EventPage/EventModal";
import type { Event } from "../types/events";
import { useSearchParams } from "react-router-dom";

type OpenArgs = { event: Event; onRsvp?: () => void };

type Ctx = { openEvent: (args: OpenArgs) => void; closeEvent: () => void };

const EventModalCtx = createContext<Ctx | null>(null);

export function useEventModal() {
  const ctx = useContext(EventModalCtx);
  if (!ctx) throw new Error("useEventModal must be used within <EventModalProvider>");
  return ctx;
}

export function EventModalProvider({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [payload, setPayload] = useState<OpenArgs | null>(null);
  const [params, setParams] = useSearchParams();

  const openEvent = useCallback(
    (args: OpenArgs) => {
      setPayload(args);
      setOpened(true);
      const p = new URLSearchParams(params);
      p.set("event", (args.event as any).title ?? "event");
      setParams(p, { replace: false });
    },
    [params, setParams]
  );

  const closeEvent = useCallback(() => {
    setOpened(false);
    setPayload(null);
    const p = new URLSearchParams(params);
    p.delete("event");
    setParams(p, { replace: false });
  }, [params, setParams]);

  const wantsOpen = params.get("event");
  const value = useMemo(() => ({ openEvent, closeEvent }), [openEvent, closeEvent]);

  return (
    <EventModalCtx.Provider value={value}>
      {children}
      {payload ? (
        <EventModal
          opened={opened || Boolean(wantsOpen)}
          onClose={closeEvent}
          event={payload.event}
          onRsvp={payload.onRsvp}
        />
      ) : null}
    </EventModalCtx.Provider>
  );
}
