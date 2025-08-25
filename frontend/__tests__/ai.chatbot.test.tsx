import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from '../pages/ai/chatbot';

jest.mock('../lib/api', () => ({
  api: {
    chatbot: async () => ({ answer: 'Hello' })
  }
}));

Object.defineProperty(window, 'localStorage', {
  value: { getItem: () => null, setItem: () => undefined },
});

it('sends a message and shows bot reply', async () => {
  render(<Chatbot />);
  fireEvent.change(screen.getByPlaceholderText(/Ask about/), { target: { value: 'Hi' } });
  fireEvent.click(screen.getByText('Send'));
  await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument());
});

