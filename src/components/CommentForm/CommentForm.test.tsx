/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import CommentForm from './CommentForm';

function makeMockStore(dispatchMock?: (a: any) => any) {
  return {
    getState: () => ({}),
    subscribe: () => () => {},
    dispatch: (dispatchMock ?? (() => ({}))) as any,
  } as any;
}

describe('CommentForm', () => {
  it('dispatches on submit', () => {
    const dispatched: any[] = [];
    const store = makeMockStore((a: any) => {
      dispatched.push(a);
      return Promise.resolve(true);
    });
    render(
      <Provider store={store}>
        <CommentForm offerId="1" />
      </Provider>
    );
    // select rating 5
    const radio = document.querySelector(
      'input[value="5"]'
    ) as HTMLInputElement;
    if (radio) {
      fireEvent.click(radio);
    }
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    const long = 'x'.repeat(60);
    fireEvent.change(textarea, { target: { value: long } });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(dispatched.length).toBeGreaterThanOrEqual(1);
  });
});
