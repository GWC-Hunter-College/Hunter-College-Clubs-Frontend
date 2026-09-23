import { http, HttpResponse } from 'msw';
import type { loadDesignData } from './data';
import { getSignedIn, memberships, MOCK_ACCESS_TOKEN } from './state';

export function createHandlers({ clubs, events }: Awaited<ReturnType<typeof loadDesignData>>) {
  const myClubs = () => HttpResponse.json({
    clubs: getSignedIn() ? clubs.filter((club) => memberships.has(club.id))
      .map((club) => ({ ...club, role: memberships.get(club.id) })) : [],
  });
  return [
    http.get('/__design_api/events', () => HttpResponse.json({ events })),
    http.get('/__design_api/events/:eventId', ({ params }) => {
      const event = events.find((item) => item.id === Number(params.eventId));
      return event ? HttpResponse.json({ event }) : HttpResponse.json({ message: 'Event not found' }, { status: 404 });
    }),
    http.get('/__design_api/clubs', ({ request }) => {
      const verified = new URL(request.url).searchParams.get('verified');
      return HttpResponse.json({ clubs: verified === null ? clubs : clubs.filter((club) => club.verified === (verified === 'true')) });
    }),
    http.get('/__design_api/clubs/:clubId', ({ params }) => {
      const club = clubs.find((item) => item.id === Number(params.clubId));
      return club ? HttpResponse.json({ club }) : HttpResponse.json({ message: 'Club not found' }, { status: 404 });
    }),
    // Includes drafts: the Club page filters them out of its public tabs itself, and its
    // Manage tab (managers only) needs them.
    http.get('/__design_api/clubs/:clubId/events', ({ params }) => {
      const clubId = Number(params.clubId);
      if (!clubs.some((club) => club.id === clubId)) return HttpResponse.json({ message: 'Club not found' }, { status: 404 });
      return HttpResponse.json({ events: events.filter((event) => event.owner?.id === clubId) });
    }),
    http.get('/__design_api/me/clubs', myClubs),
    // Home currently uses this literal alias without an Authorization header.
    http.get('/api/me/clubs', myClubs),
    ...(['post', 'delete'] as const).map((method) => http[method]('/__design_api/clubs/:clubId/members/me', ({ params, request }) => {
      if (!getSignedIn() || request.headers.get('Authorization') !== `Bearer ${MOCK_ACCESS_TOKEN}`) {
        return HttpResponse.json({ message: 'Sign in required' }, { status: 401 });
      }
      const clubId = Number(params.clubId);
      if (!clubs.some((club) => club.id === clubId)) return HttpResponse.json({ message: 'Club not found' }, { status: 404 });
      if (method === 'delete' && memberships.get(clubId) === 'owner') {
        return HttpResponse.json({ message: 'Club owners cannot leave' }, { status: 403 });
      }
      if (method === 'post') memberships.set(clubId, memberships.get(clubId) ?? 'member');
      else memberships.delete(clubId);
      return HttpResponse.json({ role: memberships.get(clubId) ?? null });
    })),
    // Unknown local API requests must fail visibly instead of reaching a backend.
    http.all('/__design_api/*', () => HttpResponse.json({ message: 'No design handler for this request' }, { status: 501 })),
  ];
}
