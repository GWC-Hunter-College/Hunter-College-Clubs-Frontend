// import { useState, useMemo, useEffect } from "react";
// import { Title } from "@mantine/core";
import { useAuthInfo } from "../types/auth";
// import type { Club } from "../types/club";
import SignInPrompt from "../components/Other/SignInPrompt";
// import { API_BASE_URL } from "../config";



import PageShell from "../components/Other/PageShell";



export default function ClubCreatePage() {
  const auth = useAuthInfo();

  // const [authorizedClubs, setAuthorizedClubs] = useState<Club[]>([]);

  // useEffect(() => {
  //   let cancelled = false;

  //   if (!auth.signedIn) {
  //     return;
  //   }

  //   const token = auth.getAccessToken();
  //   if (!token) {
  //     return;
  //   }

  //   (async () => {
  //     try {
  //       const res = await fetch(`${API_BASE_URL}/me/clubs`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const json = await res.json();

  //       const list: Array<Pick<Club, "id" | "name" | "role">> = Array.isArray(json?.clubs)
  //         ? json.clubs
  //         : [];
  //       const found = list.find((c) => String(c.id) === String(clubId));
  //       if (!cancelled) setMyRole(found?.role ?? null);
  //     } catch {
  //       if (!cancelled) setMyRole(null);
  //     } finally {
  //       if (!cancelled) setCheckingMembership(false);
  //     }
  //   })();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [auth.signedIn, auth.accessToken]);
  

  // const [submitting, setSubmitting] = useState(false);


  // async function onSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   console.log("createClub payload (stub):", {
  //     title: titleVal,
  //     description: descVal,
  //     logo: logoFile,
  //   });
  //   await new Promise((r) => setTimeout(r, 150));
  //   setSubmitting(false);
  // }

  return (
    <PageShell
      pageTitle="Event Creation"
      back={{to: "/clubs"}}
      user={{ auth }}
      size="xl"
      padded
      contentGap="lg"
    >

      {!auth.signedIn ? (
        <SignInPrompt auth={auth} message="You need to sign in to create an event." />
      ) : (
        <>
          test
        </>
      )}
    </PageShell>
  );
}
