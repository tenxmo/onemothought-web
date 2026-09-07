import { getCollection } from 'astro:content';

/** Single source of truth for the practice name. Update here, not in components. */
export const ORG_NAME = 'One Mo Solutions';
export const ORG_LOCATION = 'Atlanta, GA';
export const ORG_FOOTER = `${ORG_NAME} · ${ORG_LOCATION}`;

export const CONTACT_EMAIL = 'maurice.motion@gmail.com';

/** Featured posts required before /consulting links out to the writing index. */
export const FEATURED_THRESHOLD = 3;

export interface FeaturedGate {
  count: number;
  threshold: number;
  meetsThreshold: boolean;
}

/**
 * Counts published, featured posts: non-draft, not future-dated, featured === true.
 * Note this is stricter than /logs, which filters on draft only.
 */
export async function getFeaturedGate(now: Date = new Date()): Promise<FeaturedGate> {
  const featured = await getCollection('logs', ({ data }) => {
    return data.draft !== true && data.featured === true && data.date.valueOf() <= now.valueOf();
  });

  const count = featured.length;

  return {
    count,
    threshold: FEATURED_THRESHOLD,
    meetsThreshold: count >= FEATURED_THRESHOLD,
  };
}
