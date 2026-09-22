import type { Club } from '../types/club';

export const MOCK_ACCESS_TOKEN = 'design-only-access-token';
export const mockRole = import.meta.env.VITE_MOCK_ROLE ?? 'eboard';
const roles = ['guest', 'user', 'member', 'eboard', 'owner'];
if (!roles.includes(mockRole)) throw new Error(`Unsupported VITE_MOCK_ROLE: ${mockRole}`);

let signedIn = mockRole !== 'guest';
const listeners = new Set<() => void>();
export const getSignedIn = () => signedIn;
export function subscribeAuth(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function setSignedIn(value: boolean) {
  signedIn = value;
  listeners.forEach((listener) => listener());
}

// Session-only mutations: reloading the page restores the selected persona.
export const memberships = new Map<number, NonNullable<Club['role']>>(
  mockRole === 'user' ? [] : [
    [1, mockRole === 'guest' ? 'member' : mockRole as NonNullable<Club['role']>],
    [2, 'member'],
    [3, 'owner'],
  ],
);
