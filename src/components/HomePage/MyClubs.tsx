// src/components/sidebar/MyClubsSkeleton.tsx
import { Card, Group, Skeleton, Stack } from "@mantine/core";

export default function MyClubsSkeleton() {
  return (
    <Card p="lg" radius="xl" withBorder>
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Skeleton height={24} width={120} radius="sm" /> {/* "MY CLUBS" */}

      </Group>

      {/* Club list items */}
      <Stack gap="md">
        {[...Array(3)].map((_, i) => (
          <Card key={i} radius="xl" p="md" withBorder>
            <Group justify="space-between" wrap="nowrap">
              <Skeleton height={48} width={48} radius="md" /> {/* Logo */}
              <Stack gap="xs" style={{ flex: 1 }}>
                <Skeleton height={16} width="60%" /> {/* Club name */}
                <Group gap="sm">
                  <Skeleton height={12} width={70} radius="xl" /> {/* Member tag */}
                  <Skeleton height={12} width={70} radius="xl" /> {/* E-Board tag */}
                </Group>
              </Stack>
              <Skeleton height={24} width={24} radius="xl" /> {/* Arrow */}
            </Group>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}

