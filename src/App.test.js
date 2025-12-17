import { render, screen } from '@testing-library/react';
import App from './App';

test('renders habit tracker app', () => {
  render(<App />);
  // Check for login page content (default route redirects to /login)
  const welcomeText = screen.getByText(/welcome back/i);
  expect(welcomeText).toBeInTheDocument();
});

test('renders sign in button', () => {
  render(<App />);
  const signInButton = screen.getByRole('button', { name: /sign in/i });
  expect(signInButton).toBeInTheDocument();
});

test('renders email input field', () => {
  render(<App />);
  const emailInput = screen.getByPlaceholderText(/enter your email/i);
  expect(emailInput).toBeInTheDocument();
});
