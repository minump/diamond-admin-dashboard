import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fetchSessionData() {
  if (typeof window === 'undefined') {
    // Return empty or default values when not in a browser environment
    return { primaryIdentity: '', name: '', email: '', institution: '' };
  }
  const primaryIdentity =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('primary_identity='))
      ?.split('=')[1] ?? '';
  const name =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('name='))
      ?.split('=')[1] ?? '';
  const email =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('email='))
      ?.split('=')[1] ?? '';
  const institution =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('institution='))
      ?.split('=')[1] ?? '';

  return { primaryIdentity, name, email, institution };
}
