import { randomUUID } from 'crypto';
import { parse, serialize } from 'cookie';

/**
 * Get or create an anonymousId cookie that never expires (or expires far in the future).
 * This function runs server-side in getServerSideProps.
 */
export function getOrSetAnonymousId(req, res) {
  // Parse existing cookies
  const cookies = parse(req.headers?.cookie || '');
  let anonymousId = cookies.anonymousId;

  if (!anonymousId) {
    // Generate a new UUID
    anonymousId = randomUUID();

    // Set a very long expiration time (e.g., 10 years)
    const cookie = serialize('anonymousId', anonymousId, {
      path: '/',
      httpOnly: false, // Typically you can use non-httpOnly so JS can read it if needed
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years in seconds
    });

    // Attach Set-Cookie header
    res.setHeader('Set-Cookie', cookie);
  }

  return anonymousId;
}