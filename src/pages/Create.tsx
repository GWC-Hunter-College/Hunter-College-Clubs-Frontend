import { useMediaQuery } from "@mantine/hooks";
import { IconUsersGroup, IconCalendarPlus, IconPlus } from "@tabler/icons-react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Gate from "../components/ui/Gate";
import OptionCard from "../components/Create/OptionCard";
import useMyClubs from "../hooks/useMyClubs";
import { useAuthInfo } from "../types/auth";
import classes from "./Create.module.css";

export default function Create() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });
  const auth = useAuthInfo();
  const { clubs } = useMyClubs();
  const canPostEvent = clubs.some((c) => c.role === "eboard" || c.role === "owner");

  if (!auth.signedIn) {
    return (
      <AppShell>
        <PageContainer>
          <Gate
            icon={<IconPlus size={32} />}
            title="Sign in to create a club or an event"
            pitch="Start a club, or post an event for a club you manage. You’ll need to sign in first so we know who’s hosting."
            preview={<CreatePreview mobile={!isDesktop} />}
          />
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <div className={classes.page}>
          <PageHeader eyebrow="CREATE" title="START SOMETHING" subtitle="Give a new club a home, or post an event for a club you run." />
          <div className={isDesktop ? classes.cards : classes.mobileCards}>
            <OptionCard
              icon={<IconUsersGroup size={isDesktop ? 30 : 24} />}
              eyebrow="NEW CLUB"
              title="Start a club"
              body={
                isDesktop
                  ? "Give your club a page with a name, logo, description and topics. You become its owner and can add e-board members later."
                  : "A page for your club: name, logo, description and topics."
              }
              buttonLabel="CREATE A CLUB"
              to="/club/create"
              mobile={!isDesktop}
            />
            <OptionCard
              icon={<IconCalendarPlus size={isDesktop ? 30 : 24} />}
              eyebrow="NEW EVENT"
              title="Post an event"
              body="Choose a club you manage, add a flyer and the details, then save a draft or post it for everyone to see."
              buttonLabel="CREATE AN EVENT"
              to="/event/create"
              disabled={!canPostEvent}
              disabledNote="You need to be an owner or on the e-board of a club to post events."
              mobile={!isDesktop}
            />
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}

function CreatePreview({ mobile }: { mobile: boolean }) {
  return (
    <div className={classes.page}>
      <PageHeader eyebrow="CREATE" title="START SOMETHING" subtitle="Give a new club a home, or post an event for a club you run." />
      <div className={mobile ? classes.mobileCards : classes.cards}>
        <OptionCard
          icon={<IconUsersGroup size={mobile ? 24 : 30} />}
          eyebrow="NEW CLUB"
          title="Start a club"
          body="Give your club a page with a name, logo, description and topics."
          buttonLabel="CREATE A CLUB"
          to="/club/create"
          mobile={mobile}
        />
        <OptionCard
          icon={<IconCalendarPlus size={mobile ? 24 : 30} />}
          eyebrow="NEW EVENT"
          title="Post an event"
          body="Choose a club you manage, add a flyer and the details."
          buttonLabel="CREATE AN EVENT"
          to="/event/create"
          mobile={mobile}
        />
      </div>
    </div>
  );
}
