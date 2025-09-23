import { Box, Container, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import type { Event } from "../../types/events";
import "./EventHeader.css";

type Props = {
  title?: string;
  owner?: Event["owner"];
};

export default function EventHeader({ title = "Untitled Event", owner }: Props) {
  const clubTo = owner?.id != null ? `/club/${owner.id}` : null;
  const logoSrc = owner?.logo ?? "/logo.png";

  return (
    <Container size="lg" py="lg">
      <Group align="center" gap="md" wrap="nowrap">
        {clubTo ? (
          <Link to={clubTo} className="evhdr_ownerLink" aria-label="Go to club page">
            <span className="evhdr_backer" />
            <img className="evhdr_img" src={logoSrc} alt="Club logo" />
          </Link>
        ) : (
          <Box className="evhdr_ownerLink" aria-hidden="true">
            <span className="evhdr_backer" />
            <img className="evhdr_img" src={logoSrc} alt="" />
          </Box>
        )}

        <Box style={{ minWidth: 0 }}>
          <Title order={2} className="evhdr_title">
            {title}
          </Title>
        </Box>
      </Group>
    </Container>
  );
}
