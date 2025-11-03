import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Title,
  Text,
  Stack,
  TextInput,
  Textarea,
  FileInput,
  Group,
  Button,
  Image,
  Paper,
} from "@mantine/core";

import { useAuthInfo } from "../types/auth";
import type { Club } from "../types/club";

import SignInPrompt from "../components/Other/SignInPrompt";
import PageHeader from "../components/Other/PageHeader";
import FeaturedClubCard from "../components/ClubPage/FeaturedClubCard";

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
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  // Build a Club-shaped object for the preview card
  const previewClub: Club = {
    id: 0,
    name: titleVal.trim() || "Your club name",
    description:
      descVal.trim() ||
      "Write a short description about your club’s purpose, activities, and goals.",
    logo: previewUrl ?? undefined, // NOTE: FeaturedClubCard currently uses a placeholder image
    role: undefined,
    tags: [],
  };

  return (
    <Box p="md">
      <PageHeader pageTitle="Club Creation" back={{ size: "md" }} user={{ auth }} />

      {!auth.signedIn ? (
        <SignInPrompt auth={auth} />
      ) : (
        <Stack gap="md">
          <Paper withBorder radius="lg" p="md" component="form" onSubmit={onSubmit}
            style={{
              backgroundColor: "#2A1F3F",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
            }}
          >
            <Stack gap="md">
              <TextInput
                label="Club Title"
                placeholder="Enter the Name of the Club Here"
                value={titleVal}
                onChange={(e) => setTitleVal(e.currentTarget.value)}
                required
                size="lg"
                variant="unstyled"
                styles={{
                  input: {
                    background: "var(--mantine-color-dark-6)",
                    border: "1px solid var(--mantine-color-dark-4)",
                    borderRadius: "30px",
                    padding: "14px 16px",
                    color: "var(--mantine-color-white)",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    backgroundColor: "#a1989825",
                  },
                  label: { color: "var(--mantine-color-gray-4)", fontWeight: 600 },
                }}
              />

              <FileInput
                label="Club Logo"
                placeholder="Select an image file"
                accept="image/*"
                value={logoFile}
                onChange={setLogoFile}
                clearable
                variant="unstyled"
                styles={{
                  input: {
                    background: "var(--mantine-color-dark-6)",
                    border: "1px solid var(--mantine-color-dark-4)",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    color: "var(--mantine-color-white)",
                    backgroundColor: "#a1989825",
                  },
                  label: { color: "var(--mantine-color-gray-4)", fontWeight: 600 },
                }}
              />

              {previewUrl && false && (
                <Image
                  src={previewUrl}
                  alt="Logo preview"
                  fit="contain"
                  mah={180}
                  radius="md"
                />
              )}

              <Textarea
                label="Description"
                placeholder="Describe your club, activities, and goals"
                value={descVal}
                onChange={(e) => setDescVal(e.currentTarget.value)}
                autosize
                minRows={8}
                required
                variant="unstyled"
                styles={{
                  input: {
                    background: "var(--mantine-color-dark-6)",
                    border: "1px solid var(--mantine-color-dark-4)",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    color: "var(--mantine-color-white)",
                    lineHeight: 1.5,
                    backgroundColor: "#a1989825",
                  },
                  label: { color: "var(--mantine-color-gray-4)", fontWeight: 600 },
                }}
              />

              <Group justify="flex-end">
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={!titleVal.trim() || !descVal.trim()}
                >
                  Submit
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Live Preview */}
          <Stack gap="sm" mt="lg">
            <Title order={3}>Preview</Title>
            <FeaturedClubCard club={previewClub} />
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
