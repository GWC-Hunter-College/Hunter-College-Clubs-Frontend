import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // Exercise the app without internet. Only its pre-existing optional web fonts are stubbed.
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.fulfill({ contentType: 'text/css', body: '' }));
});

for (const [path, text] of [
  ['/', 'Upcoming Events'],
  ['/clubs', 'CLUB DIRECTORY'],
  ['/club/1', 'Girls Who Code'],
  ['/event/13', 'Girls Who Code — Club Fair'],
  ['/club/create', 'Club details'],
  ['/event/create', 'Event Create Page'],
  ['/auth', 'alex.rivera@example.test'],
]) {
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
    await expect(page.getByText(text, { exact: path !== '/auth' }).first()).toBeVisible();
    if (path === '/') await expect(page.getByText('Girls Who Code — Club Fair', { exact: true })).toBeVisible();
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect.poll(() => page.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('screen.png'), fullPage: true });
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
    expect(failures).toEqual([]);
  });
}

test('directory search, populated memberships, and navigation', async ({ page }) => {
  await page.goto('/clubs');
  await expect(page.getByText('eboard', { exact: true })).toBeVisible();
  await expect(page.getByText('member', { exact: true })).toBeVisible();
  await expect(page.getByText('owner', { exact: true })).toBeVisible();
  await page.getByPlaceholder('Search clubs...').fill('Robotics');
  await page.getByRole('button', { name: 'SEARCH', exact: true }).click();
  await expect(page.getByText('Robotics Club', { exact: true })).toBeVisible();
  await expect(page.getByText('Chess Club', { exact: true })).toHaveCount(0);
  await page.getByRole('img', { name: 'Robotics Club', exact: true }).click();
  await expect(page).toHaveURL(/\/club\/5$/);
  await expect(page.getByRole('button', { name: 'JOIN →' })).toBeVisible();
});

test('join and leave persist across SPA navigation and reset on reload', async ({ page }) => {
  await page.goto('/club/5');
  await page.getByRole('button', { name: 'JOIN →' }).click();
  await expect(page.getByRole('button', { name: 'LEAVE', exact: true })).toBeVisible();
  const readMemberships = () => page.evaluate(async () => (await (await fetch('/api/me/clubs')).json()).clubs);
  expect(await readMemberships()).toEqual(expect.arrayContaining([expect.objectContaining({ id: 5, role: 'member' })]));
  await page.getByRole('button', { name: /back/i }).click();
  await expect(page).toHaveURL(/\/clubs$/);
  await expect(page.getByRole('link', { name: 'Go to Robotics Club page' })).toBeVisible();
  await page.getByRole('link', { name: 'Go to Robotics Club page' }).click();
  await page.getByRole('button', { name: 'LEAVE', exact: true }).click();
  await expect(page.getByRole('button', { name: 'JOIN →' })).toBeVisible();
  expect(await readMemberships()).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: 5 })]));
  await page.getByRole('button', { name: 'JOIN →' }).click();
  await expect(page.getByRole('button', { name: 'LEAVE', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'JOIN →' })).toBeVisible();
});

test('existing owner state hides membership actions', async ({ page }) => {
  await page.goto('/club/3');
  await expect(page.getByRole('heading', { name: 'Studio Arts Collective' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'LEAVE', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'JOIN →' })).toHaveCount(0);
});

test('event modal, descriptions, past events, and local RSVP destination', async ({ page }) => {
  await page.goto('/club/1');
  await page.getByText('Girls Who Code — Club Fair', { exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Meet the Girls Who Code team/)).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'RSVP' })).toHaveAttribute('href', '/event/13');
  await page.keyboard.press('Escape');
  await page.getByText('Previous', { exact: true }).click();
  await expect(page.getByText('First Kickoff Meeting', { exact: true })).toBeVisible();
});

test('mock auth signs out and in locally; create form and upload preview work', async ({ page }) => {
  await page.goto('/club/create');
  await page.getByRole('textbox', { name: 'Club Title', exact: true }).fill('Demo Makers Club');
  await page.getByLabel('Description', { exact: true }).fill('A demo community for student makers and collaborative projects.');
  await page.locator('input[type=file]').setInputFiles('public/logo.png');
  await expect(page.getByRole('heading', { name: 'Demo Makers Club' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page.getByRole('textbox', { name: 'Club Title', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Sign in', exact: true }).first().click();
  await expect(page.getByRole('textbox', { name: 'Club Title', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/club\/create$/);
});

test('mock contracts include valid relationships, filters, membership authorization, and not-found responses', async ({ page }) => {
  await page.goto('/auth');
  await expect(page.getByText(/alex.rivera@example.test/)).toBeVisible();
  const result = await page.evaluate(async () => {
    const get = async (path: string) => (await fetch(`/__design_api${path}`)).json();
    return {
      clubs: (await get('/clubs')).clubs,
      verified: (await get('/clubs?verified=true')).clubs,
      unverified: (await get('/clubs?verified=false')).clubs,
      events: (await get('/events')).events,
      missingClub: (await fetch('/__design_api/clubs/999')).status,
      missingEvent: (await fetch('/__design_api/events/999')).status,
      unauthorized: (await fetch('/__design_api/clubs/5/members/me', { method: 'POST' })).status,
      ownerCannotLeave: (await fetch('/__design_api/clubs/3/members/me', { method: 'DELETE', headers: { Authorization: 'Bearer design-only-access-token' } })).status,
      unknown: (await fetch('/__design_api/unsupported')).status,
    };
  });
  expect(result.clubs).toHaveLength(9);
  expect(result.verified).toHaveLength(8);
  expect(result.unverified).toHaveLength(1);
  expect(result.events).toHaveLength(17);
  const ids = result.clubs.map((club: { id: number }) => club.id);
  for (const event of result.events) {
    expect(ids).toContain(event.owner.id);
    expect(event.flyer).toMatch(/^\//);
    expect(new Date(event.end).getTime()).toBeGreaterThan(new Date(event.start).getTime());
    expect(event.description).toBeTruthy();
    for (const associate of event.associates) expect(ids).toContain(associate.id);
  }
  expect(result).toMatchObject({ missingClub: 404, missingEvent: 404, unauthorized: 401, ownerCannotLeave: 403, unknown: 501 });
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
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
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
