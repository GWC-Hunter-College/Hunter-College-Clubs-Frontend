import { useState, useMemo, useEffect } from "react";
import { Box, Title } from "@mantine/core";
import { useAuthInfo } from "../types/auth";
import type { Club } from "../types/club";
import SignInPrompt from "../components/Other/SignInPrompt";
import PageHeader from "../components/Other/PageHeader";
import FeaturedClubCard from "../components/ClubPage/FeaturedClubCard";
import ClubFormPanel from "../components/ClubCreate/ClubFormPanel";

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
    console.log("createClub payload (stub):", { title: titleVal, description: descVal, logo: logoFile });
    await new Promise((r) => setTimeout(r, 150));
    setSubmitting(false);
  }

  const previewClub: Club = {
    id: 0,
    name: titleVal.trim() || "Your club name",
    description: descVal.trim() || "Write a short description about your club’s purpose, activities, and goals.",
    logo: previewUrl ?? undefined,
    role: undefined,
    tags: [],
  };

  return (
    <Box p="md">
      <PageHeader pageTitle="Club Creation" back={{ size: "md" }} user={{ auth }} />
      {!auth.signedIn ? (
        <SignInPrompt auth={auth} />
      ) : (
        <Box maw={1100} mx="auto" w="100%">
          <Title order={3} mb="sm">Preview</Title>
          <FeaturedClubCard club={previewClub} />

          <Title order={3} mt="lg" mb="sm">Club details</Title>
          <ClubFormPanel
            titleVal={titleVal}
            descVal={descVal}
            logoFile={logoFile}
            setTitleVal={setTitleVal}
            setDescVal={setDescVal}
            setLogoFile={setLogoFile}
            submitting={submitting}
            onSubmit={onSubmit}
          />
        </Box>
      )}
    </Box>
  );
}
