import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendar, IconClock, IconMapPin, IconLink, IconPhotoPlus, IconUsers } from "@tabler/icons-react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Button from "../components/ui/Button";
import ClubLogo from "../components/ui/ClubLogo";
import EventArt from "../components/ui/EventArt";
import { Field, TextareaField, Dropzone, LockedOptionRow } from "../components/ui/Inputs";
import ComingSoonPanel from "../components/ui/ComingSoonPanel";
import Gate from "../components/ui/Gate";
import { useHideMobileTabBar, useMobileDetailHeader } from "../components/shell/useShell";
import useClub from "../hooks/useClub";
import useMembership from "../hooks/useMembership";
import useClubEvents from "../hooks/useClubEvents";
import { useAuthInfo } from "../types/auth";
import { API_BASE_URL } from "../config";
import { formatDayColumn, formatTimeRange } from "../lib/datetime";
import { wallTimeToUtcIso } from "../lib/timezone";
import classes from "./EventForm.module.css";

// Typed times are read as America/New_York wall-clock time (the app's display default, since
// the form has no timezone field), not the browser's own timezone — otherwise the live preview
// and the posted event would show different times whenever the browser's local zone isn't ET.
function combineIso(date: string, time: string) {
  if (!date || !time) return null;
  return wallTimeToUtcIso(date, time);
}

function shortDateBadge(date: string) {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${d.getDate()}`;
}

export default function EventForm() {
  const { clubId } = useParams<{ clubId: string }>();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draft");
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const navigate = useNavigate();
  const auth = useAuthInfo();

  const { club } = useClub(clubId);
  const { role } = useMembership(clubId);
  const { events } = useClubEvents(clubId);
  const canManage = role === "eboard" || role === "owner";

  const draft = useMemo(() => events.find((e) => String(e.id) === draftId), [events, draftId]);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreviewUrl, setFlyerPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [description, setDescription] = useState("");
  const [rsvpLink, setRsvpLink] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<"draft" | "posted" | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (draft && !prefilled) {
      setTitle(draft.title);
      const start = new Date(draft.start);
      const end = new Date(draft.end);
      const pad = (n: number) => String(n).padStart(2, "0");
      setStartDate(`${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`);
      setStartTime(`${pad(start.getHours())}:${pad(start.getMinutes())}`);
      setEndDate(`${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`);
      setEndTime(`${pad(end.getHours())}:${pad(end.getMinutes())}`);
      setLocation(draft.location);
      setAltText(draft.altText ?? "");
      setDescription(draft.description ?? "");
      setRsvpLink(draft.rsvpLink ?? "");
      setPrefilled(true);
    }
  }, [draft, prefilled]);

  useEffect(() => {
    if (!flyerFile) {
      setFlyerPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(flyerFile);
    setFlyerPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [flyerFile]);

  useMobileDetailHeader("New event", "/event/create");
  useHideMobileTabBar(true);

  if (!auth.signedIn) {
    return (
      <AppShell>
        <PageContainer>
          <Gate
            icon={<IconCalendar size={32} />}
            title="Sign in to create a club or an event"
            pitch="Start a club, or post an event for a club you manage. You’ll need to sign in first so we know who’s hosting."
            preview={<div />}
          />
        </PageContainer>
      </AppShell>
    );
  }

  if (club && !canManage) {
    return (
      <AppShell>
        <PageContainer detail>
          <ComingSoonPanel
            icon={<IconUsers size={30} />}
            title="You don’t manage this club"
            text="Only a club's owner or e-board can post events for it."
            action={
              <Button to="/event/create" variant="ghost" size="m">
                CHOOSE A DIFFERENT CLUB
              </Button>
            }
          />
        </PageContainer>
      </AppShell>
    );
  }

  // Shared by the live preview and submit(), so both agree on the same start/end.
  function computeIsoRange() {
    const startIso = combineIso(startDate, startTime) ?? new Date().toISOString();
    const fallbackEndIso = new Date(new Date(startIso).getTime() + 2 * 3_600_000).toISOString();
    // A stale end value can outlive an edited start (e.g. resuming a dateless draft and only
    // changing the start date leaves the old end in place) — fall back rather than show/post an
    // event that ends before it starts.
    const combinedEndIso = combineIso(endDate || startDate, endTime);
    const endIso = combinedEndIso && combinedEndIso > startIso ? combinedEndIso : fallbackEndIso;
    return { startIso, endIso };
  }

  const previewWhen = (() => {
    if (!startDate || !startTime) return "WED · 5:00 – 7:00 PM";
    const { startIso, endIso } = computeIsoRange();
    return `${formatDayColumn(startIso).weekday} · ${formatTimeRange(startIso, endIso)}`;
  })();

  async function submit(status: "draft" | "posted") {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Add a title for this event.";
    if (status === "posted") {
      if (!startDate) newErrors.startDate = "Pick a start date.";
      if (!startTime) newErrors.startTime = "Pick a start time.";
      if (!location.trim()) newErrors.location = "Add a location.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const token = auth.getAccessToken();
    if (!token || !clubId) return;

    const { startIso, endIso } = computeIsoRange();

    setSubmitting(status);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/${clubId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          event: { title: title.trim(), location: location.trim(), rsvpLink: rsvpLink.trim() || undefined, startDate: startIso, endDate: endIso },
          description: description.trim() || undefined,
          status,
          flyer: flyerPreviewUrl ?? undefined,
          altText: altText.trim() || undefined,
        }),
      });
      if (!res.ok) {
        setErrors({ submit: "We couldn’t save this event right now. Please try again." });
        return;
      }
      const json = await res.json();
      if (status === "posted") navigate(`/event/${json.eventId}`);
      else navigate("/event/create");
    } catch {
      setErrors({ submit: "We couldn’t save this event right now. Please try again." });
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <AppShell>
      <PageContainer detail>
        <div className={classes.page}>
          {isDesktop && <Breadcrumb segments={["CREATE", "NEW EVENT", (club?.name ?? "").toUpperCase()]} to="/event/create" />}
          <PageHeader eyebrow="CREATE" title="NEW EVENT" />

          <div className={classes.row}>
            <div className={classes.formCol}>
              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>Basics</h2>
                {club && (
                  <div className={classes.hostedBy}>
                    <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={32} />
                    <span className={classes.hostedByText}>
                      <span className={`${classes.hostedByEyebrow} text-meta-mono-caps`}>HOSTED BY</span>
                      <span className={`${classes.hostedByName} text-body-m-strong`}>{club.name}</span>
                    </span>
                    <Button to="/event/create" variant="ghost" size="s">
                      CHANGE
                    </Button>
                  </div>
                )}
                <Field id="event-title" label="Event title" required value={title} onChange={(e) => setTitle(e.currentTarget.value)} errorText={errors.title} />
              </div>

              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>When &amp; where</h2>
                <div className={classes.fieldRow}>
                  <Field id="start-date" label="Starts" required type="date" icon={<IconCalendar size={18} />} value={startDate} onChange={(e) => setStartDate(e.currentTarget.value)} errorText={errors.startDate} />
                  <Field id="start-time" label="Start time" required type="time" icon={<IconClock size={18} />} value={startTime} onChange={(e) => setStartTime(e.currentTarget.value)} errorText={errors.startTime} />
                </div>
                <div className={classes.fieldRow}>
                  <Field id="end-date" label="Ends" type="date" icon={<IconCalendar size={18} />} value={endDate} onChange={(e) => setEndDate(e.currentTarget.value)} />
                  <Field id="end-time" label="End time" type="time" icon={<IconClock size={18} />} value={endTime} onChange={(e) => setEndTime(e.currentTarget.value)} />
                </div>
                <Field id="location" label="Location" required icon={<IconMapPin size={18} />} value={location} onChange={(e) => setLocation(e.currentTarget.value)} errorText={errors.location} />
              </div>

              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>Flyer</h2>
                <Dropzone
                  label="Event flyer"
                  prompt="Drop a file here, or click to upload"
                  help="PNG or JPG. Square works best. You can post without one."
                  file={flyerFile}
                  onChange={setFlyerFile}
                />
                <Field
                  id="alt-text"
                  label="Alt text"
                  value={altText}
                  onChange={(e) => setAltText(e.currentTarget.value)}
                  helperText="Describes the flyer for people using screen readers."
                />
              </div>

              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>More options</h2>
                <div className={classes.lockedOptions}>
                  <LockedOptionRow icon={<IconPhotoPlus size={20} />} title="More photos for this event" sub="Add extra images beyond the flyer" />
                  <LockedOptionRow icon={<IconUsers size={20} />} title="Co-hosting clubs" sub="List other clubs as associates" secondary />
                </div>
              </div>

              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>Details</h2>
                <TextareaField id="description" label="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} />
                <Field
                  id="rsvp-link"
                  label="RSVP link (optional)"
                  icon={<IconLink size={18} />}
                  placeholder="https://forms.gle/…"
                  value={rsvpLink}
                  onChange={(e) => setRsvpLink(e.currentTarget.value)}
                />
              </div>

              {errors.submit && (
                <p className="text-caption" style={{ color: "var(--state-danger-soft)" }}>
                  {errors.submit}
                </p>
              )}

              {isDesktop && (
                <div className={classes.actionBar}>
                  <Button variant="ghost" size="m" onClick={() => navigate(-1)}>
                    CANCEL
                  </Button>
                  <Button variant="outline" size="m" disabled={submitting !== null} onClick={() => submit("draft")}>
                    SAVE DRAFT
                  </Button>
                  <Button variant="primary" size="l" disabled={submitting !== null} onClick={() => submit("posted")}>
                    POST EVENT
                  </Button>
                </div>
              )}
            </div>

            {isDesktop && (
              <div className={classes.previewCol}>
                <p className={`${classes.previewEyebrow} text-meta-mono-caps`}>LIVE PREVIEW</p>
                <div className={classes.previewCard}>
                  <div className={classes.previewArt}>
                    <EventArt src={flyerPreviewUrl ?? undefined} alt={title || "Event flyer"} size="100%" radius={0} clubId={club?.id ?? 0} title={title || "New event"} />
                    {startDate && <span className={`${classes.dateBadge} text-meta-mono-caps`}>{shortDateBadge(startDate)}</span>}
                    <span className={classes.previewLogo}>
                      <ClubLogo clubId={club?.id ?? 0} name={club?.name ?? "Hunter CS"} logo={club?.logo} size={40} />
                    </span>
                  </div>
                  <h3 className={`${classes.previewTitle} text-heading-m`}>{title || "Your event title"}</h3>
                  <p className={`${classes.previewWhen} text-meta-mono`}>{previewWhen}</p>
                  <p className={`${classes.previewPlace} text-caption`}>{location || "Location"}</p>
                </div>

                <p className={`${classes.previewRowEyebrow} text-meta-mono-caps`}>ON THE HOME LIST</p>
                <div className={classes.previewRow}>
                  <EventArt src={flyerPreviewUrl ?? undefined} alt="" size={56} radius={10} clubId={club?.id ?? 0} title={title || "New event"} />
                  <span className={classes.previewRowText}>
                    <p className="text-meta-mono-caps" style={{ color: "var(--brand-primary)" }}>
                      {previewWhen}
                    </p>
                    <p className="text-body-m-strong">{title || "Your event title"}</p>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {!isDesktop && (
        <div className={classes.actionBar}>
          <Button variant="outline" size="m" disabled={submitting !== null} onClick={() => submit("draft")}>
            SAVE DRAFT
          </Button>
          <Button variant="primary" size="m" disabled={submitting !== null} onClick={() => submit("posted")}>
            POST EVENT
          </Button>
        </div>
      )}
    </AppShell>
  );
}
