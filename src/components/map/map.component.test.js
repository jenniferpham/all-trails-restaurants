import { render, screen } from '@testing-library/react';
import RestaurantList from './restaurant-list';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
