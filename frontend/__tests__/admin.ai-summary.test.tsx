import { render, screen, waitFor } from '@testing-library/react';
import AdminAISummary from '../pages/admin/ai-summary';

jest.mock('../lib/api', () => ({
  api: {
    adminAISummary: async () => ({ summary: 'Summary ok' })
  }
}));

Object.defineProperty(window, 'localStorage', {
  value: { getItem: () => 'token' },
});

it('renders admin AI summary', async () => {
  render(<AdminAISummary />);
  await waitFor(() => expect(screen.getByText('Summary ok')).toBeInTheDocument());
});

