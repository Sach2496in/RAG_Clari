import { MessageFormatterPipe } from './message-formatter.pipe';

describe('MessageFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new MessageFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
