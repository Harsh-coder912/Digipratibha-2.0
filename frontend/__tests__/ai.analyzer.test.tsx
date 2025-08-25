import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Analyzer from '../pages/ai/analyzer';

jest.mock('../lib/api', () => ({
  api: {
    analyzeProject: async () => ({ strengths: ['solid idea'], weaknesses: ['scope'], suggestions: ['iterate'] })
  }
}));

Object.defineProperty(window, 'localStorage', {
  value: { getItem: () => 'token' },
});

it('shows analyzer sections', async () => {
  render(<Analyzer />);
  fireEvent.change(screen.getByPlaceholderText('Project title'), { target: { value: 'Title' } });
  fireEvent.change(screen.getByPlaceholderText('Describe your project idea...'), { target: { value: 'Desc' } });
  fireEvent.click(screen.getByText('Analyze'));
  await waitFor(() => expect(screen.getByText('solid idea')).toBeInTheDocument());
  expect(screen.getByText('scope')).toBeInTheDocument();
  expect(screen.getByText('iterate')).toBeInTheDocument();
});

