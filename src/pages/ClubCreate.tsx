import { useState, useMemo, useEffect } from "react";
import { Title } from "@mantine/core";
import { useAuthInfo } from "../types/auth";
import type { Club } from "../types/club";
import SignInPrompt from "../components/Other/SignInPrompt";
import FeaturedClubCard from "../components/ClubPage/FeaturedClubCard";
import ClubFormPanel from "../components/ClubCreate/ClubFormPanel";

import PageShell from "../components/Other/PageShell";

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default function ClubCreatePage() {
  const auth = useAuthInfo();

  const [titleVal, setTitleVal] = useState("");
  const [descVal, setDescVal] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const previewUrl = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : null),
    [logoFile]
  );
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    console.log("createClub payload (stub):", {
      title: titleVal,
      description: descVal,
      logo: logoFile,
    });
    await new Promise((r) => setTimeout(r, 150));
    setSubmitting(false);
  }

  const previewClub: Club = {
    id: 0,
    name: titleVal.trim() || "Your club name",
    description:
      truncate(
        (descVal.trim() ||
          "Write a short description about your club’s purpose, activities, and goals."),
        220
      ),
    logo: previewUrl ?? undefined,
    role: undefined,
    tags: [],
  };

  return (
    <PageShell
      pageTitle="Club Creation"
      back={{to: "/clubs"}}
      user={{ auth }}
      size="xl"
      padded
      contentGap="lg"
    >

      {!auth.signedIn ? (
        <SignInPrompt auth={auth} />
      ) : (
        <>
          <Title order={4} mb="xs">
            Preview
          </Title>
          <FeaturedClubCard club={previewClub} />

          <Title order={4} mt="md" mb="xs">
            Club details
          </Title>
          <ClubFormPanel
            titleVal={titleVal}
            descVal={descVal}
            logoFile={logoFile}
            setTitleVal={setTitleVal}
            setDescVal={setDescVal}
            setLogoFile={setLogoFile}
            submitting={submitting}
            onSubmit={onSubmit}
            compact
            minRows={5}
          />
        </>
      )}
    </PageShell>
  );
}
