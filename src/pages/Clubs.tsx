import { useMemo, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import { SearchField } from "../components/ui/Inputs";
import ClubCard from "../components/ui/ClubCard";
import useClubs from "../hooks/useClubs";
import classes from "./Clubs.module.css";
import heroArt from "../assets/hero.png";
import raArt from "../assets/ra.png";

const BANNERS = [raArt, heroArt];

export default function Clubs() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const { clubs } = useClubs();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter(
      (club) => club.name.toLowerCase().includes(q) || club.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [clubs, query]);

  return (
    <AppShell>
      <PageContainer>
        <div className={classes.page}>
          <PageHeader eyebrow="CLUBS" title="FIND YOUR CLUB" subtitle={`${clubs.length} clubs at Hunter CS.`} />
          <SearchField
            compact={!isDesktop}
            placeholder={isDesktop ? "Search clubs by name or topic…" : "Search clubs…"}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            aria-label="Search clubs"
          />
          {filtered.length === 0 ? (
            <p className={`${classes.empty} text-body-m`}>No clubs match &ldquo;{query}&rdquo;.</p>
          ) : isDesktop ? (
            <div className={classes.grid}>
              {filtered.map((club, i) => (
                <ClubCard key={club.id} club={club} bannerSrc={BANNERS[club.id % BANNERS.length] ?? BANNERS[i % BANNERS.length]} />
              ))}
            </div>
          ) : (
            <div className={classes.list}>
              {filtered.map((club) => (
                <ClubCard key={club.id} club={club} bannerSrc="" mobile />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}
