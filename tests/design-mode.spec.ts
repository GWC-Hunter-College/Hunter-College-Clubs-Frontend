import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // Exercise the app without internet. Only its pre-existing optional web fonts are stubbed.
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.fulfill({ contentType: 'text/css', body: '' }));
});

// eboard is the default VITE_MOCK_ROLE for the mock webServer: signed in, Girls Who Code (1)
// eboard, Computer Science Club (2) member, Studio Arts Collective (3) owner.
for (const [path, heading] of [
  ['/', 'CLUBS & EVENTS'],
  ['/events', 'EVERYTHING COMING UP'],
  ['/clubs', 'FIND YOUR CLUB'],
  ['/club/1', 'Girls Who Code'],
  ['/event/13', 'Girls Who Code — Club Fair'],
  ['/my-clubs', 'YOUR CLUBS & EVENTS'],
  ['/create', 'START SOMETHING'],
  ['/event/create', 'WHO’S HOSTING?'],
  ['/club/1/event/new', 'NEW EVENT'],
  ['/club/create', 'NEW CLUB'],
  ['/auth', null],
] as const) {
  test(`renders ${path} without backend traffic or console errors`, async ({ page, context }, testInfo) => {
    const errors: string[] = [];
    const external: string[] = [];
    const failures: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    context.on('request', (request) => {
      const url = new URL(request.url());
      if (!['127.0.0.1', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) external.push(url.href);
    });
    page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await page.goto(path);
    if (heading) await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible();
    else await expect(page.getByText('alex.rivera@example.test')).toBeVisible();
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('screen.png'), fullPage: true });
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
    expect(failures).toEqual([]);
  });
}

test('directory search and navigation to a club', async ({ page }) => {
  await page.goto('/clubs');
  await page.getByPlaceholder('Search clubs by name or topic…').fill('Robotics');
  await expect(page.getByRole('heading', { name: 'Robotics Club' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chess Club' })).toHaveCount(0);
  await page.getByRole('link', { name: /Robotics Club/ }).first().click();
  await expect(page).toHaveURL(/\/club\/5$/);
  await expect(page.getByRole('button', { name: '+ JOIN CLUB' })).toBeVisible();
});

test('join and leave persist across SPA navigation and reset on reload', async ({ page }) => {
  await page.goto('/club/5');
  await page.getByRole('button', { name: '+ JOIN CLUB' }).click();
  await expect(page.getByRole('button', { name: /JOINED/ })).toBeVisible();
  const readMemberships = () => page.evaluate(async () =>
    (await (await fetch('/__design_api/me/clubs', { headers: { Authorization: 'Bearer design-only-access-token' } })).json()).clubs);
  expect(await readMemberships()).toEqual(expect.arrayContaining([expect.objectContaining({ id: 5, role: 'member' })]));

  // Leave via the Joined menu, confirming in the modal.
  await page.getByRole('button', { name: /JOINED/ }).click();
  await page.getByText('Leave club', { exact: true }).click();
  await expect(page.getByText('Leave Robotics Club?', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'LEAVE CLUB', exact: true }).click();
  await expect(page.getByRole('button', { name: '+ JOIN CLUB' })).toBeVisible();
  expect(await readMemberships()).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: 5 })]));

  await page.getByRole('button', { name: '+ JOIN CLUB' }).click();
  await expect(page.getByRole('button', { name: /JOINED/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: '+ JOIN CLUB' })).toBeVisible();
});

test('owners cannot leave their club', async ({ page }) => {
  await page.goto('/club/3');
  await expect(page.getByRole('heading', { name: 'Studio Arts Collective' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: '+ JOIN CLUB' })).toHaveCount(0);
  await page.getByRole('button', { name: /JOINED/ }).click();
  await expect(page.getByText('Leave club', { exact: true })).toHaveCount(0);
});

test('event page: description, RSVP, past events, and the share popover', async ({ page }) => {
  await page.goto('/club/1');
  await page.getByText('Girls Who Code — Club Fair', { exact: true }).first().click();
  await expect(page).toHaveURL(/\/event\/13$/);
  await expect(page.getByText(/Meet the Girls Who Code team/)).toBeVisible();
  const rsvpHref = await page.getByRole('link', { name: /RSVP/ }).getAttribute('href');
  expect(rsvpHref).toMatch(/^https:\/\//);

  await page.getByRole('button', { name: 'SHARE', exact: true }).click();
  await expect(page.getByText('SHARE THIS EVENT', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'COPY', exact: true }).click();
  await expect(page.getByRole('button', { name: 'COPIED', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'ADD TO CALENDAR', exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.ics$/);

  await page.goto('/club/1');
  await page.getByRole('button', { name: /SHOW PAST EVENTS/ }).click();
  await page.getByText('First Kickoff Meeting', { exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'First Kickoff Meeting' })).toBeVisible();
  await expect(page.getByText('PAST EVENT', { exact: true })).toBeVisible();
});

test('mock auth signs out and in locally; club create form, live preview, and upload work', async ({ page }) => {
  await page.goto('/club/create');
  await page.getByLabel('Club name').fill('Demo Makers Club');
  await page.getByLabel('Description', { exact: true }).fill('A demo community for student makers and collaborative projects.');
  await expect(page.getByRole('heading', { name: 'Demo Makers Club' })).toBeVisible();
  await page.locator('input[type=file]').setInputFiles('public/logo.png');
  await expect(page.locator('img[alt=""]').first()).toBeVisible();

  await page.getByRole('button', { name: 'Open account menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page.getByText('Sign in to create a club or an event')).toBeVisible();
  await page.getByRole('button', { name: 'SIGN IN', exact: true }).first().click();
  // The form is the same component instance across the sign-out/sign-in blip, so it keeps
  // whatever the user had typed rather than losing it — this checks the gate cycle, not reset.
  await expect(page.getByLabel('Club name')).toBeVisible();
  await expect(page).toHaveURL(/\/club\/create$/);
});

test('signed-out gates protect My Clubs and the create flows', async ({ page }) => {
  await page.goto('/my-clubs');
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  // Client-side nav (no reload) keeps the signed-out state for this check.
  await page.getByRole('link', { name: /^HOME$/ }).first().click();
  await page.getByRole('link', { name: /^MY CLUBS$/ }).first().click();
  await expect(page.getByText('Sign in to see your clubs and events')).toBeVisible();
  await page.getByRole('link', { name: 'BROWSE EVENTS INSTEAD', exact: true }).click();
  await expect(page).toHaveURL(/\/events$/);

  await page.getByRole('link', { name: /^CREATE$/ }).first().click();
  await expect(page.getByText('Sign in to create a club or an event')).toBeVisible();
});

test('create flows end to end: save a draft, resume it, post it, and create a club', async ({ page }) => {
  await page.goto('/event/create');
  await page.getByText('Girls Who Code', { exact: true }).click();
  await page.getByRole('button', { name: /CONTINUE/ }).click();
  await expect(page).toHaveURL(/\/club\/1\/event\/new$/);

  await page.getByLabel('Event title').fill('E2E Draft Event');
  await page.getByRole('button', { name: 'SAVE DRAFT', exact: true }).click();
  await expect(page).toHaveURL(/\/event\/create$/);
  await expect(page.getByText('E2E Draft Event', { exact: true }).first()).toBeVisible();

  await page.locator('a', { hasText: 'E2E Draft Event' }).first().click();
  await expect(page.getByLabel('Event title')).toHaveValue('E2E Draft Event');
  await page.getByLabel('Starts').fill('2026-11-01');
  await page.getByLabel('Start time').fill('17:00');
  await page.getByLabel('Location').fill('Great Hall');
  await page.getByRole('button', { name: 'POST EVENT', exact: true }).click();
  await expect(page).toHaveURL(/\/event\/\d+$/);
  await expect(page.getByRole('heading', { name: 'E2E Draft Event' })).toBeVisible();

  await page.getByRole('link', { name: /^EVENTS$/ }).first().click();
  await page.getByPlaceholder('Search events by name, club or place…').fill('E2E Draft');
  await expect(page.getByText('E2E Draft Event', { exact: true }).first()).toBeVisible();

  await page.getByRole('link', { name: /^HOME$/ }).first().click();
  await expect(page.getByText('E2E Draft Event', { exact: true }).first()).toBeVisible();

  await page.goto('/club/create');
  await page.getByLabel('Club name').fill('E2E New Club');
  await page.getByLabel('Description', { exact: true }).fill('Created end to end by the test suite.');
  await page.getByText('TECHNOLOGY', { exact: true }).click();
  await page.getByRole('button', { name: 'CREATE CLUB', exact: true }).click();
  await expect(page).toHaveURL(/\/club\/\d+$/);
  await expect(page.getByRole('heading', { name: 'E2E New Club' })).toBeVisible();
  await expect(page.getByText('owner', { exact: true })).toBeVisible();
});

test('mock contracts: relationships, filters, drafts, write endpoints, and not-found responses', async ({ page }) => {
  await page.goto('/auth');
  await expect(page.getByText(/alex.rivera@example.test/)).toBeVisible();
  const result = await page.evaluate(async () => {
    const token = 'design-only-access-token';
    const auth = { headers: { Authorization: `Bearer ${token}` } };
    const get = async (path: string) => (await fetch(`/__design_api${path}`)).json();
    const createEvent = await fetch('/__design_api/clubs/1/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ event: { title: 'Contract Test Event', location: 'Room 1', startDate: '2026-12-01T17:00:00.000Z', endDate: '2026-12-01T19:00:00.000Z' }, status: 'posted' }),
    });
    const createClub = await fetch('/__design_api/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ club: { name: 'Contract Test Club', description: 'x' } }),
    });
    return {
      clubs: (await get('/clubs')).clubs,
      verified: (await get('/clubs?verified=true')).clubs,
      unverified: (await get('/clubs?verified=false')).clubs,
      events: (await get('/events')).events,
      clubEvents: (await get('/clubs/1/events')).events,
      myEvents: (await (await fetch('/__design_api/me/events', auth)).json()).events,
      missingClub: (await fetch('/__design_api/clubs/999')).status,
      missingEvent: (await fetch('/__design_api/events/999')).status,
      missingClubEvents: (await fetch('/__design_api/clubs/999/events')).status,
      unauthorizedMyEvents: (await fetch('/__design_api/me/events')).status,
      unauthorized: (await fetch('/__design_api/clubs/5/members/me', { method: 'POST' })).status,
      ownerCannotLeave: (await fetch('/__design_api/clubs/3/members/me', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })).status,
      unauthorizedCreateEvent: (await fetch('/__design_api/clubs/1/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status,
      unauthorizedCreateClub: (await fetch('/__design_api/clubs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status,
      createEventStatus: createEvent.status,
      createEventBody: await createEvent.json(),
      createClubStatus: createClub.status,
      createClubBody: await createClub.json(),
      unknown: (await fetch('/__design_api/unsupported')).status,
    };
  });
  expect(result.clubs).toHaveLength(10); // 9 seeded + the club created in this test
  expect(result.verified).toHaveLength(8);
  expect(result.unverified.length).toBeGreaterThanOrEqual(1);
  expect(result.events.length).toBeGreaterThanOrEqual(23); // 22 seeded + the event created in this test
  const ids = result.clubs.map((club: { id: number }) => club.id);
  for (const event of result.events) {
    expect(ids).toContain(event.owner.id);
    if (event.flyer) expect(typeof event.flyer).toBe('string');
    expect(new Date(event.end).getTime()).toBeGreaterThan(new Date(event.start).getTime());
    for (const associate of event.associates ?? []) expect(ids).toContain(associate.id);
  }
  expect(result.clubEvents.every((e: { owner: { id: number } }) => e.owner.id === 1)).toBe(true);
  expect(result.clubEvents.some((e: { status: string }) => e.status === 'draft')).toBe(true);
  expect(result.myEvents.every((e: { status: string }) => e.status !== 'draft')).toBe(true);
  expect(result).toMatchObject({
    missingClub: 404, missingEvent: 404, missingClubEvents: 404,
    unauthorizedMyEvents: 401, unauthorized: 401, ownerCannotLeave: 403,
    unauthorizedCreateEvent: 401, unauthorizedCreateClub: 401,
    createEventStatus: 200, createClubStatus: 200, unknown: 501,
  });
  expect(result.createEventBody).toHaveProperty('eventId');
  expect(result.createClubBody).toHaveProperty('clubId');
});

test.describe('390px viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Home, Club, and Event have no horizontal overflow and show the mobile chrome', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'HOME' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    await page.goto('/club/1');
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    await page.getByText('Girls Who Code — Club Fair', { exact: true }).first().click();
    await expect(page).toHaveURL(/\/event\/13$/);
    await expect(page.getByRole('link', { name: /RSVP/ })).toBeVisible();
    // The Event page replaces the tab bar with its own fixed action bar.
    await expect(page.getByRole('link', { name: 'CLUBS' })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
});

test('disabled mode uses the real API URL and OIDC provider, without a mock worker', async ({ page, context }) => {
  const requests: string[] = [];
  context.on('request', (request) => requests.push(request.url()));
  // This controlled response verifies the application's original real API path.
  await page.route('**/backend/clubs?verified=true', (route) => route.fulfill({
    json: { clubs: [{ id: 42, name: 'Real API Contract Test Club' }] },
  }));
  await page.goto('http://127.0.0.1:5175/clubs');
  await expect(page.getByText('Real API Contract Test Club')).toBeVisible();
  await expect(page.getByRole('button', { name: 'SIGN IN', exact: true })).toBeVisible();
  expect(requests.some((url) => url.includes('/backend/clubs?verified=true'))).toBe(true);
  expect(requests.filter((url) => /mockServiceWorker|\/src\/mocks\/|__design_api/.test(url))).toEqual([]);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  await page.goto('http://127.0.0.1:5175/auth');
  await page.route('**/oidc/.well-known/openid-configuration', (route) => route.fulfill({ json: {
    issuer: 'http://127.0.0.1:5175/oidc',
    authorization_endpoint: 'http://127.0.0.1:5175/oidc/authorize',
    token_endpoint: 'http://127.0.0.1:5175/oidc/token',
  } }));
  await page.route('**/oidc/authorize?**', (route) => route.fulfill({ contentType: 'text/plain', body: 'Reached real OIDC redirect flow' }));
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/oidc\/authorize\?/);
  await expect(page.getByText('Reached real OIDC redirect flow')).toBeVisible();
});
