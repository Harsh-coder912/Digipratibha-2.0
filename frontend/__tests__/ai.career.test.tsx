import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Career from '../pages/ai/career';

jest.mock('../lib/api', () => ({
  api: {
    careerRecommendation: async () => ({ recommendedCareers: [{ title: 'SE', description: 'Build', requiredSkills: ['JS'], learningPath: ['Learn JS'] }] })
  }
}));

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => 'token',
    setItem: () => undefined,
  },
});

it('submits and renders recommendations', async () => {
  render(<Career />);
  fireEvent.change(screen.getByPlaceholderText(/e\.g\., React/), { target: { value: 'React' } });
  fireEvent.change(screen.getByPlaceholderText(/Web Dev/), { target: { value: 'Web' } });
  fireEvent.change(screen.getByPlaceholderText(/Undergraduate/), { target: { value: 'UG' } });
  fireEvent.click(screen.getByText(/Get Recommendations/));
  await waitFor(() => expect(screen.getByText('SE')).toBeInTheDocument());
});

