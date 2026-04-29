import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: null, role: null, loading: false }),
}));

jest.mock('../../services/firebase', () => ({ auth: {} }));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));

import LoginPage from './Login';

test('renders login form', () => {
  render(<BrowserRouter><LoginPage /></BrowserRouter>);
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('renders email and password fields', () => {
  render(<BrowserRouter><LoginPage /></BrowserRouter>);
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});