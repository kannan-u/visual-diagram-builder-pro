import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: null, role: null, loading: false }),
}));

jest.mock('../../services/firebase', () => ({ auth: {} }));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));

import RegisterPage from './RegisterPage';

test('renders register form', () => {
  render(<BrowserRouter><RegisterPage /></BrowserRouter>);
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('renders email and password fields', () => {
  render(<BrowserRouter><RegisterPage /></BrowserRouter>);
  expect(screen.getByRole('textbox')).toBeInTheDocument(); // email input
  expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
});

test('renders Create Account heading', () => {
  render(<BrowserRouter><RegisterPage /></BrowserRouter>);
  expect(screen.getByText('Create Account')).toBeInTheDocument();
});