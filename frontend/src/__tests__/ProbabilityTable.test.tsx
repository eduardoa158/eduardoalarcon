import React from 'react';
import { render, screen } from '@testing-library/react';

import { ProbabilityTable } from '@/components/ProbabilityTable';

describe('ProbabilityTable', () => {
  it('renders probabilities as percentages', () => {
    render(<ProbabilityTable probabilities={{ home_win: 0.5, draw: 0.3, away_win: 0.2 }} />);

    expect(screen.getByText('50.0%')).toBeInTheDocument();
    expect(screen.getByText('30.0%')).toBeInTheDocument();
    expect(screen.getByText('20.0%')).toBeInTheDocument();
  });
});
