import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl + "/new") as Promise<any>;
  }

  getTopBarLeft() {
    return element(by.css('mat-toolbar div h1')).getText() as Promise<string>;
  }

  getSprintNameFromTopBar () {
    return element(by.binding('sprint?.Name')).getText() as Promise<string>;
  }

  getUserNameFromTopBar() {
    return element(by.binding('user?.Name')).getText() as Promise<string>;
  }

}
