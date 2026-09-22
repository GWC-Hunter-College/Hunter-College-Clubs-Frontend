import { setupWorker } from 'msw/browser';
import { loadDesignData } from './data';
import { createHandlers } from './handlers';
import MockAuthProvider from './MockAuthProvider';

export async function startDesignMode() {
  const data = await loadDesignData();
  const worker = setupWorker(...createHandlers(data));
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest(request, print) {
      const url = new URL(request.url);
      // Keep Vite modules, public assets, and the existing Google Fonts stylesheet working.
      if (url.origin === location.origin && !url.pathname.startsWith('/api/')) return;
      if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) return;
      print.error();
    },
  });
  return MockAuthProvider;
}
