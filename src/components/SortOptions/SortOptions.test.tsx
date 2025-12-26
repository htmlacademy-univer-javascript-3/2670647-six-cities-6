/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { render, screen, fireEvent } from '@testing-library/react';
import SortOptions from './SortOptions';

describe('SortOptions', () => {
  it('opens options and selects a value', () => {
    const onChange = vi.fn();
    render(<SortOptions value="Popular" onChange={onChange} />);
    const opener = screen
      .getAllByText('Popular')
      .find(
        (n) => n.classList && n.classList.contains('places__sorting-type')
      ) as HTMLElement;
    fireEvent.click(opener);
    const option = screen.getByText('Price: low to high');
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalledWith('Price: low to high');
  });
});
