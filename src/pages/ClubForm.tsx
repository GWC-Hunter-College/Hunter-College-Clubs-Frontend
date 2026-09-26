import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import Button from "../components/ui/Button";
import ClubLogo from "../components/ui/ClubLogo";
import { Field, TextareaField, Dropzone } from "../components/ui/Inputs";
import { ChipFilter } from "../components/ui/Pills";
import Gate from "../components/ui/Gate";
import { useHideMobileTabBar, useMobileDetailHeader } from "../components/shell/useShell";
import { useAuthInfo } from "../types/auth";
import { API_BASE_URL } from "../config";
import { initialsFor } from "../lib/clubTint";
import classes from "./ClubForm.module.css";

const TOPICS = ["TECHNOLOGY", "ARTS", "COMMUNITY", "WOMEN IN STEM", "CAREER", "SPORTS"];
const MAX_TOPICS = 3;

export default function ClubForm() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const navigate = useNavigate();
  const auth = useAuthInfo();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useMobileDetailHeader("New club", "/create");
  useHideMobileTabBar(true);

  const handleLogoChange = (file: File | null) => {
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
    setLogoFile(file);
  };

  const toggleTopic = (topic: string) => {
    setTopics((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length >= MAX_TOPICS) return prev;
      return [...prev, topic];
    });
  };

  if (!auth.signedIn) {
    return (
      <AppShell>
        <PageContainer>
          <Gate
            icon={<IconPlus size={32} />}
            title="Sign in to create a club or an event"
            pitch="Start a club, or post an event for a club you manage. You’ll need to sign in first so we know who’s hosting."
            preview={<div />}
          />
        </PageContainer>
      </AppShell>
    );
  }

  async function submit() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Give your club a name.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const token = auth.getAccessToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/clubs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          club: { name: name.trim(), description: description.trim() },
          logo: logoPreviewUrl ?? undefined,
          tags: topics,
        }),
      });
      if (!res.ok) {
        setErrors({ submit: "We couldn’t create this club right now. Please try again." });
        return;
      }
      const json = await res.json();
      navigate(`/club/${json.clubId}`);
    } catch {
      setErrors({ submit: "We couldn’t create this club right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const previewName = name.trim() || "Your club name";
  const previewDesc = description.trim() || "Write a short description about your club’s purpose, activities and goals.";

  return (
    <AppShell>
      <PageContainer detail>
        <div className={classes.page}>
          {isDesktop && <Breadcrumb segments={["CREATE", "NEW CLUB"]} to="/create" />}
          <PageHeader eyebrow="CREATE" title="NEW CLUB" />

          <div className={classes.row}>
            <div className={classes.formCol}>
              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>Basics</h2>
                <Field id="club-name" label="Club name" required value={name} onChange={(e) => setName(e.currentTarget.value)} errorText={errors.name} />
                <TextareaField id="club-description" label="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} />
              </div>

              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>Logo</h2>
                <Dropzone
                  label="Club logo"
                  prompt="Drop a file here, or click to upload"
                  help="Square PNG or JPG, at least 256 × 256. Skip it and we’ll use your initials."
                  file={logoFile}
                  onChange={handleLogoChange}
                />
              </div>

              <div className={classes.card}>
                <h2 className={`${classes.cardTitle} text-heading-m`}>Topics</h2>
                <div className={classes.chips}>
                  {TOPICS.map((topic) => (
                    <ChipFilter key={topic} selected={topics.includes(topic)} onClick={() => toggleTopic(topic)}>
                      {topic}
                    </ChipFilter>
                  ))}
                </div>
                <p className={`${classes.helper} text-caption`}>Pick up to three. People use these to find your club on Discover.</p>
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
                  <Button variant="primary" size="l" disabled={submitting} onClick={submit}>
                    CREATE CLUB
                  </Button>
                </div>
              )}
            </div>

            {isDesktop && (
              <div className={classes.previewCol}>
                <p className={`${classes.previewEyebrow} text-meta-mono-caps`}>LIVE PREVIEW &middot; HOW IT LOOKS ON DISCOVER</p>
                <div className={classes.previewCard}>
                  <div className={classes.previewBanner}>
                    <div className={classes.previewLogoWrap}>
                      {logoPreviewUrl ? (
                        <ClubLogo clubId={0} name={previewName} logo={logoPreviewUrl} size={64} />
                      ) : (
                        <div className={classes.previewInitials}>
                          <span className="text-heading-m">{initialsFor(previewName)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={classes.previewBody}>
                    <h3 className={`${classes.previewName} text-heading-m`}>{previewName}</h3>
                    {topics.length > 0 && (
                      <div className={classes.chips}>
                        {topics.map((topic) => (
                          <span key={topic} className="text-chip" style={{ color: "var(--text-secondary)" }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className={`${classes.previewDesc} text-body-m`}>{previewDesc}</p>
                  </div>
                </div>
                <p className={`${classes.previewNote} text-caption`}>
                  You&rsquo;ll be the owner. You can add e-board members, post events and edit this page after you create it.
                </p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {!isDesktop && (
        <div className={classes.actionBar}>
          <Button variant="primary" size="m" disabled={submitting} onClick={submit}>
            CREATE CLUB
          </Button>
        </div>
      )}
    </AppShell>
  );
}
