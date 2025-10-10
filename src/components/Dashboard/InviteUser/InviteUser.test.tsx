import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InviteUser from './InviteUser';
import { useAuth } from '../../../hooks/useAuth';

// Mock useAuth
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('InviteUser Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: '123' } });
  });

  test('renders input, select and button', () => {
    render(<InviteUser />);
    expect(screen.getByPlaceholderText('User email')).toBeInTheDocument();
    expect(screen.getByText('Invite')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('shows alert when email is empty', () => {
    window.alert = jest.fn();
    render(<InviteUser />);
    fireEvent.click(screen.getByText('Invite'));
    expect(window.alert).toHaveBeenCalledWith('Please enter an email');
  });

  test('resets input after successful invite', async () => {
    // Mock Firestore addDoc
    const addDocMock = jest.fn().mockResolvedValue({});
    jest.mock('firebase/firestore', () => ({
      collection: jest.fn(),
      addDoc: addDocMock,
      serverTimestamp: jest.fn(),
    }));

    render(<InviteUser />);
    const input = screen.getByPlaceholderText('User email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Invite'));

    // Wait for async
    await new Promise((r) => setTimeout(r, 0));
    expect(input).toHaveValue('');
  });
});
