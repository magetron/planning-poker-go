import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('/new page', async () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('top bar is visible', () => {
    page.navigateTo();
    expect(page.getTopBarLeft()).toEqual('Planning Poker');
  });

  //ends up with "pending"
  xit('sprint name should be empty', async () => {
    await page.navigateTo();
    console.log('page loaded')
    const sprintName = await page.getSprintNameFromTopBar();
    console.log('sprintname', sprintName)
    expect(sprintName).toBeFalsy();
  })

  //ends up with "pending"
  xit('username should be empty', () => {
    page.navigateTo();
    expect(page.getUserNameFromTopBar()).toBeUndefined()
  })

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
