import {fireEvent, render, screen} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import { useLocation, Route, Routes, MemoryRouter } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {AuthProvider} from './AuthProvider';
import type { User } from '../types/user';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Buttons';
import ProtectedRoute from '../components/ProtectedRoute';
import { waitFor } from '@testing-library/react';


describe('AuthProvider Component', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should set user from localStorage on mount', () => {
        const mockUser: User = {
            _id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'owner',
            businessName: 'Test Business',
        };
        const mockToken = 'mock-token'; 
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockToken);

        // Mocking the component to consume the AuthContext 
        const TestConsumer = () => {
            const { user, loading } = useAuth(); 
            
            if (loading) return <div>Cargando...</div>;
            
            return (
                <div>
                <span data-testid="name">{user?.name}</span>
                <span data-testid="email">{user?.email}</span>
                </div>
            );
        };

        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByTestId('name')).toHaveTextContent('Test User');
        expect(screen.getByTestId('email')).toHaveTextContent('test@example.com');
        expect(localStorage.getItem('token')).toBe(mockToken);
    });

    it('should logout user and clear localStorage', () => {
        const mockUser: User = {
            _id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'owner',
            businessName: 'Test Business',
        };
        const mockToken = 'mock-token'; 
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockToken);

        // Mocking the component to consume the AuthContext 
        const TestConsumer = () => {
            const { user, logout, loading } = useAuth(); 
            
            if (loading) return <div>Cargando...</div>;
                        
            return (
                <div>
                {user ? (
                    <>
                    <span data-testid="user-name">{user.name}</span>
                    <Button onClick={logout}>Cerrar Sesión</Button>
                    </>
                ) : (
                    <span data-testid="no-user">No hay usuario</span>
                )}
                </div>
            );
        };

        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            </MemoryRouter>
        );

        // Simulate logout
        fireEvent.click(screen.getByText('Cerrar Sesión'));

        expect(screen.getByTestId('no-user')).toHaveTextContent('No hay usuario');
        expect(localStorage.getItem('user')).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    })

    it('should set user and token on login', () => {
        // Mocking the component to consume the AuthContext
        const mockLoginData = {
        token: 'token-123',
        _id: 'user-123',
        name: 'Gabriela',
        email: 'gabi@test.com',
        role: 'owner',
        businessName: 'Mi Negocio'
        };

        const TestConsumer = () => {
            const { user, login, loading } = useAuth();
            // inital state
            if (loading) return <div>Cargando...</div>;
            return (
                <div>
                    {user ? (
                        <span data-testid="user-name">{user.name}</span>
                    ): (
                        <Button onClick={() => login(mockLoginData)}>Iniciar Sesión</Button>
                    )}
                </div>
            )
        };
        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            </MemoryRouter>
        );
        // Simulate login
        fireEvent.click(screen.getByText('Iniciar Sesión'));

        expect(screen.getByTestId('user-name')).toHaveTextContent(mockLoginData.name);
        expect(localStorage.getItem('token')).toBe(mockLoginData.token);
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        expect(savedUser).toEqual({
            _id: mockLoginData._id,
            name: mockLoginData.name,
            email: mockLoginData.email,
            role: mockLoginData.role,
            businessName: mockLoginData.businessName
        });
    })

    it('should navigate to admin dashboard when role is admin', () => {
        // Spy on navigate function
        const LocationDisplay = () => {
            const location = useLocation();
            return <div data-testid="location-display">{location.pathname}</div>;
        };

        const adminData = {
            token: 'token-admin',
            _id: 'admin-123',
            name: 'Admin Boss',
            email: 'admin@test.com',
            role: 'admin', 
            businessName: 'Admin Corp'
        };

        const TestConsumer = () => {
            const { login } = useAuth();
            return <Button onClick={() => login(adminData)}>Login como Admin</Button>;
        };

        render(
            <MemoryRouter initialEntries={['/login']}>
                <AuthProvider>
                    <TestConsumer />
                    <LocationDisplay />
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Login como Admin'));

        expect(screen.getByTestId('location-display')).toHaveTextContent('/admin/dashboard');
    });

    it('should navigate to dashboard when role is owner', () => {
        localStorage.clear();
        // Spy on navigate function
        const LocationDisplay = () => {
            const location = useLocation();
            return <div data-testid="location-display">{location.pathname}</div>;
        };

        const ownerData = {
            token: 'token-owner',
            _id: 'owner-123',
            name: 'Owner User',
            email: 'owner@test.com',
            role: 'owner', 
            businessName: 'Admin Corp'
        };

        const TestConsumer = () => {
            const { login } = useAuth();
            return <Button onClick={() => login(ownerData)}>Login como Owner</Button>;
        };

        render(
            <MemoryRouter initialEntries={['/login']}>
                <AuthProvider>
                    <TestConsumer />
                    <LocationDisplay />
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Login como Owner'));

        expect(screen.getByTestId('location-display')).toHaveTextContent('/dashboard');
    });

    it('should redirect to login if user is not authenticated', async () => {
        // Spy on navigate function
        const LocationDisplay = () => {
            const location = useLocation();
            return <div data-testid="location-display">{location.pathname}</div>;
        };

        render(
        // we try to access a protected route without being authenticated
            <MemoryRouter initialEntries={['/dashboard']}>
                <AuthProvider>
                    <Routes>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<div>Contenido Privado</div>} />
                        </Route>
                        
                        <Route path="/login" element={<div>Página de Login</div>} />
                    </Routes>
                    <LocationDisplay />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/login');
        });

    })

})