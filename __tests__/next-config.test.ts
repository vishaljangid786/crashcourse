import type { NextConfig } from 'next';

describe('Next.js PostHog Configuration', () => {
  let nextConfig: NextConfig;

  beforeEach(async () => {
    // Dynamically import the config
    jest.isolateModules(() => {
      nextConfig = require('../next.config').default;
    });
  });

  describe('PostHog ingestion rewrite rules', () => {
    test('5. Next.js rewrite rules for PostHog ingestion are correctly configured', async () => {
      // Verify rewrites function exists
      expect(nextConfig.rewrites).toBeDefined();
      expect(typeof nextConfig.rewrites).toBe('function');

      // Get the rewrite rules
      const rewrites = await nextConfig.rewrites!();

      // Verify we have an array of rewrites
      expect(Array.isArray(rewrites)).toBe(true);
      expect(rewrites).toHaveLength(2);

      // Verify the static assets rewrite rule
      const staticRewrite = rewrites[0];
      expect(staticRewrite).toEqual({
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      });

      // Verify the main ingestion rewrite rule
      const mainRewrite = rewrites[1];
      expect(mainRewrite).toEqual({
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      });
    });

    test('5. Static assets rewrite rule is configured correctly', async () => {
      const rewrites = await nextConfig.rewrites!();
      const staticRewrite = rewrites[0];

      expect(staticRewrite.source).toBe('/ingest/static/:path*');
      expect(staticRewrite.destination).toBe('https://us-assets.i.posthog.com/static/:path*');
    });

    test('5. Main ingestion rewrite rule is configured correctly', async () => {
      const rewrites = await nextConfig.rewrites!();
      const mainRewrite = rewrites[1];

      expect(mainRewrite.source).toBe('/ingest/:path*');
      expect(mainRewrite.destination).toBe('https://us.i.posthog.com/:path*');
    });

    test('skipTrailingSlashRedirect is enabled', () => {
      expect(nextConfig.skipTrailingSlashRedirect).toBe(true);
    });
  });
});
