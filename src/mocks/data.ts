import { fromJsonClub } from '../types/club';
import { fromJsonEvent } from '../types/events';
import { additionalClubs, additionalEvents, draftEvents } from './fixtures';
import type { DesignClub, DesignEvent } from './fixtures';

// Design-system §6: only these raster images are approved for reuse. Anything else (old
// bit.ly demo links, react.svg) falls back to the club-tint art EventArt renders for flyer-less events.
const ALLOWED_IMAGES = new Set(['/card.png', '/ra.png', '/hero.png', '/logo.png']);
const allowedImage = (src: string | undefined) => (src && ALLOWED_IMAGES.has(src) ? src : undefined);

function schedule(days: number, durationHours = 2) {
  const start = new Date();
  start.setDate(start.getDate() + days);
  start.setHours(17, 0, 0, 0);
  return { start: start.toISOString(), end: new Date(+start + durationHours * 3_600_000).toISOString() };
}

async function fixture(name: string) {
  const response = await fetch(`/data/${name}.json`);
  if (!response.ok) throw new Error(`Cannot load design fixture: ${name}`);
  return response.json();
}

export async function loadDesignData(): Promise<{ clubs: DesignClub[]; events: DesignEvent[] }> {
  const [clubJson, eventJson, myEventJson] = await Promise.all([
    fixture('demo-club'), fixture('demo-event'), fixture('demo-event-me'),
  ]);
  const gwc = fromJsonClub(clubJson);
  if (!gwc || !Array.isArray(eventJson.events) || !Array.isArray(myEventJson.events)) {
    throw new Error('The existing demo fixtures do not match the expected club/event contract.');
  }
  const clubs: DesignClub[] = [
    { ...gwc, role: undefined, verified: true, memberCount: 64,
      description: 'A community of students empowering each other through coding workshops, mentorship, and projects. Join Girls Who Code at Hunter for beginner-friendly learning, career conversations, and collaborative projects. All majors and experience levels are welcome.',
      tags: ['Technology', 'Women in STEM', 'Community'] },
    ...additionalClubs,
  ].map((club) => ({ ...club, thumbnailUrl: club.logo }));

  // Both old event files use club 2 for GWC, 3 for CS, and 1 for cooking.
  // Preserve event IDs while making the relationships agree with demo-club.json.
  const clubIds: Record<number, number> = { 1: 4, 2: 1, 3: 2 };
  const owner = (id: number) => ({ id, logo: clubs.find((club) => club.id === id)?.logo });
  const seeded = new Map<number, DesignEvent>();
  for (const raw of [...eventJson.events, ...myEventJson.events]) {
    const event = fromJsonEvent(raw);
    if (seeded.has(event.id)) continue;
    const clubId = clubIds[event.owner?.id ?? 2];
    const title = event.id === 2 ? 'Computer Science Workshop' : event.id === 3 ? 'Cooking Workshop' : event.title;
    const durationHours = (+new Date(event.end) - +new Date(event.start)) / 3_600_000;
    const days = [1, 8, 12].includes(event.id) ? -event.id * 2 : event.id * 3;
    seeded.set(event.id, {
      ...event,
      title,
      location: event.id === 2 ? 'Hunter North, Room 304' : event.id === 3 ? 'Hunter West, Room 505' : event.location,
      ...schedule(days, durationHours),
      flyer: allowedImage(event.flyer) ?? '/ra.png',
      owner: owner(clubId),
      associates: event.associates?.map((associate) => owner(clubIds[associate.id])),
      rsvpLink: `https://forms.gle/hunter-cs-event-${event.id}`,
      altText: `${title} demo flyer`,
      description: `Join ${clubs.find((club) => club.id === clubId)?.name} for ${title.toLowerCase()}. Meet fellow students, exchange ideas, and try something new. This is a demo event for local design work.`,
    });
  }
  for (const event of additionalEvents) {
    seeded.set(event.id, {
      id: event.id, title: event.title, location: event.location,
      ...schedule(event.days, event.durationHours),
      flyer: event.flyer, owner: owner(event.clubId), associates: [], images: event.images,
      status: event.status ?? 'posted', description: event.description,
      altText: `${event.title} demo flyer`, rsvpLink: `https://forms.gle/hunter-cs-event-${event.id}`,
    });
  }
  for (const event of draftEvents) {
    seeded.set(event.id, {
      id: event.id, title: event.title, location: event.location,
      ...schedule(event.days, event.durationHours),
      flyer: event.flyer, owner: owner(event.clubId), associates: [],
      status: 'draft', description: event.description, altText: `${event.title} demo flyer`,
    });
  }
  return { clubs, events: [...seeded.values()].sort((a, b) => +new Date(a.start) - +new Date(b.start)) };
}
