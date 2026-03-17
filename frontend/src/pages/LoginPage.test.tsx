import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider';
import LoginPage from './LoginPage';
import api from '../api/axios';

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shold show error if credentials are invalid', async () => {
    const mockedPost = vi.mocked(api.post);

    mockedPost.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: { message: 'Email o contraseña inválidos' },
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
    // Fill and fire the login form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'passsword123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    const errorMessage = await screen.findByText(
      /email o contraseña inválidos/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('should login user when credentials are valid', async () => {
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location-display">{location.pathname}</div>;
    };
    const mockedPost = vi.mocked(api.post);
    mockedPost.mockResolvedValueOnce({
      data: {
        _id: 'testID',
        name: 'Carlos Lopez',
        email: 'carlos@gmail.com',
        role: 'owner',
        businessName: 'Carlos Bar',
        token: 'token1234',
      },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <LoginPage />
          <LocationDisplay />
        </AuthProvider>
      </MemoryRouter>
    );
    // Fill and fire the login form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'carlos@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'passsword123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(
        '/dashboard'
      );
    });
    expect(localStorage.getItem('token')).toBe('token1234');
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    expect(savedUser.name).toBe('Carlos Lopez');
  });

  it('should disable button while loading', async () => {
    let resolveApi: any;
    const pendingPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    vi.mocked(api.post).mockReturnValue(pendingPromise);

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
    // Fill and fire the login form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'carlos@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'passsword123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    // Button should be disabled
    const loadingButton = screen.getByRole('button', { name: /Procesando/i });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton.querySelector('svg')).toHaveClass('animate-spin');
    resolveApi({ data: {} });
  });
});
