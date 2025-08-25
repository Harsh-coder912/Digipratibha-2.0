import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '../pages/ai/search';

jest.useFakeTimers();

jest.mock('../lib/api', () => ({
  api: {
    aiSearch: async () => ({ results: [{ title: 'Doc', link: 'http://x' }] })
  }
}));

Object.defineProperty(window, 'localStorage', {
  value: { getItem: () => 'token' },
});

it('renders search results', async () => {
  render(<Search />);
  fireEvent.change(screen.getByPlaceholderText(/Search resources smartly/), { target: { value: 'doc' } });
  await waitFor(() => expect(screen.getByText('Doc')).toBeInTheDocument());
});
