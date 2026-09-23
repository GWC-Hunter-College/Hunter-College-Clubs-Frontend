import { IconSparkles } from "@tabler/icons-react";
import AppShell from "../components/shell/AppShell";
import PageContainer from "../components/ui/PageContainer";
import ComingSoonPanel from "../components/ui/ComingSoonPanel";

/** Placeholder for routes not yet rebuilt to the redesign; replaced page-by-page across phases. */
export default function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <AppShell>
      <PageContainer>
        <ComingSoonPanel
          icon={<IconSparkles size={30} />}
          title={title}
          text={`This screen is being rebuilt to the new design in ${phase}.`}
        />
      </PageContainer>
    </AppShell>
  );
}
