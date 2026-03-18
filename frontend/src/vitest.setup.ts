import { vi } from 'vitest';
import '@testing-library/jest-dom';

global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mocking the relative route of axios instace
vi.mock('./api/axios', () => {
  // Defining the object outside the return and then passing it to default ensures
  // that Vitest maintains the reference.
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  return {
    default: mockApi,
    ...mockApi,
  };
});
