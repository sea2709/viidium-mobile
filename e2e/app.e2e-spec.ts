import { NewsMobilePage } from './app.po';

describe('news-mobile App', () => {
  let page: NewsMobilePage;

  beforeEach(() => {
    page = new NewsMobilePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
