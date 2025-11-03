import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Title,
  Text,
  CloseButton,
  Stack,
  TextInput,
  Textarea,
  Group,
  Button,
  Paper,
  Avatar,
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

  const previewClub: Club = {
    id: 0,
    name: titleVal.trim() || "Your club name",
    description:
      descVal.trim() ||
      "Write a short description about your club’s purpose, activities, and goals.",
    logo: previewUrl ?? undefined,
    role: undefined,
    tags: [],
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  function openFileDialog() {
    fileInputRef.current?.click();
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.currentTarget.files?.[0] ?? null;
    setLogoFile(f);
    e.currentTarget.value = "";
  }

  return (
    <Box p="md">
      <PageHeader pageTitle="Club Creation" back={{ size: "md" }} user={{ auth }} />

      {!auth.signedIn ? (
        <SignInPrompt auth={auth} />
      ) : (
        <Stack gap="md">
          <Paper
            withBorder
            radius="lg"
            p="md"
            component="form"
            onSubmit={onSubmit}
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

              {/* Chip-style logo uploader */}
              <div>
                <Text fw={600} c="gray.4" mb={6}>
                  Club Logo
                </Text>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />

                {!logoFile ? (
                  <Button
                    onClick={openFileDialog}
                    radius="xl"
                    variant="outline"
                    size="sm"
                    styles={{
                      root: {
                        borderStyle: "dashed",
                        borderColor: "var(--mantine-color-dark-4)",
                        background: "var(--mantine-color-dark-6)",
                        color: "var(--mantine-color-gray-1)",
                        fontWeight: 700,
                        backgroundColor: "#4e3f63d1",
                      },
                    }}
                  >
                    + Add image
                  </Button>
                ) : (
                  <Group gap="xs" wrap="nowrap" align="center">
                    <Paper
                      radius="xl"
                      withBorder
                      p="xs"
                      px="md"
                      style={{
                        background: "#2A1F3F",
                        backgroundColor: "#3d2f5137",
                      }}
                    >
                      <Group gap="sm" wrap="nowrap" align="center">
                        <Avatar
                          src={previewUrl ?? undefined}
                          size={24}
                          radius="xl"
                          styles={{
                            root: {
                              background: "#2A1F3F",
                              border: "1px solid rgba(255,255,255,0.12)",
                            },
                          }}
                        />
                        <Text
                          size="sm"
                          fw={600}
                          style={{
                            maxWidth: 360,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "var(--mantine-color-gray-0)",
                          }}
                          title={logoFile.name}
                        >
                          {logoFile.name}
                        </Text>
                      </Group>
                    </Paper>

                    <CloseButton
                      aria-label="Remove image"
                      onClick={() => setLogoFile(null)}
                      size="lg"
                      title="Remove"
                      style={{
                        background: "#2A1F3F",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 9999,
                        color: "var(--mantine-color-gray-2)",
                        opacity: 0.55,
                        transition: "opacity .12s ease, filter .12s ease",
                        filter: "brightness(0.98)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.filter = "brightness(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.55";
                        e.currentTarget.style.filter = "brightness(0.98)";
                      }}
                    />
                  </Group>
                )}
              </div>

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

          <Stack gap="sm" mt="lg">
            <Title order={3}>Preview</Title>
            <FeaturedClubCard club={previewClub} />
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
