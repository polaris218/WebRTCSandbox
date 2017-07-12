import { SandboxUiA2Page } from './app.po';

describe('sandbox-ui-a2 App', () => {
  let page: SandboxUiA2Page;

  beforeEach(() => {
    page = new SandboxUiA2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
