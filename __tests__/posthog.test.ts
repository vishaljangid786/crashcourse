import posthog from 'posthog-js';

// Mock posthog-js
jest.mock('posthog-js', () => ({
  init: jest.fn(),
}));

describe('PostHog Client Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('PostHog client initialization', () => {
    test('1. PostHog client is initialized with the correct API key', () => {
      // Set up environment variable
      process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-api-key-12345';

      // Import the module (this will execute the init call)
      jest.isolateModules(() => {
        require('../instrumentation-client');
      });

      // Verify init was called with the correct API key
      expect(posthog.init).toHaveBeenCalledWith(
        'test-api-key-12345',
        expect.any(Object)
      );
    });

    test('2. PostHog client is configured with the correct API host and UI host', () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-api-key-12345';

      jest.isolateModules(() => {
        require('../instrumentation-client');
      });

      // Verify init was called with correct host configuration
      expect(posthog.init).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          api_host: '/ingest',
          ui_host: 'https://us.posthog.com',
        })
      );
    });

    test('3. PostHog client correctly enables exception capturing', () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-api-key-12345';

      jest.isolateModules(() => {
        require('../instrumentation-client');
      });

      // Verify capture_exceptions is enabled
      expect(posthog.init).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          capture_exceptions: true,
        })
      );
    });

    test('4. PostHog client sets debug mode to true in development environment', () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-api-key-12345';
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        require('../instrumentation-client');
      });

      // Verify debug mode is enabled in development
      expect(posthog.init).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          debug: true,
        })
      );
    });

    test('4. PostHog client sets debug mode to false in production environment', () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-api-key-12345';
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        require('../instrumentation-client');
      });

      // Verify debug mode is disabled in production
      expect(posthog.init).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          debug: false,
        })
      );
    });

    test('PostHog client has correct defaults configuration', () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-api-key-12345';

      jest.isolateModules(() => {
        require('../instrumentation-client');
      });

      // Verify defaults configuration
      expect(posthog.init).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          defaults: '2025-05-24',
        })
      );
    });
  });
});
