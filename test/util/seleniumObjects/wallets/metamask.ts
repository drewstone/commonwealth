/* eslint-disable */
import { By, WebDriver } from 'selenium-webdriver';

export class MetaMask {

  // setup/wallet import objects
  private metaMaskGetStartedBtn = By.xpath('//*[@id="app-content"]/div/div[2]/div/div/div/button')
  private importWalletBtn = By.xpath("//button[text()='Import wallet']")
  private noThanksBtn = By.xpath("//button[text()='No Thanks']")
  private recoveryPhraseInput = By.className('MuiInputBase-input MuiInput-input')
  private recoveryPhrase = String(process.env.METAMASK_RECOVERY_PHRASE)
  private newPasswordOne = By.id("password")
  private newPasswordTwo = By.id("confirm-password")
  private password = String(process.env.METAMASK_PASSWORD)
  private termsCheckBox = By.xpath("//*[@id=\"app-content\"]/div/div[2]/div/div/form/div[7]/div");
  private finalImportBtn = By.xpath("//button[text()='Import']");
  private allDoneBtn = By.xpath("//button[text()='All Done']");
  private whatsNew = By.xpath(`//*[@id="popover-content"]/div/div/section/header/div/button`)

  // sign txn objects

  /**
   * Assumes the driver has just opened and injected MetaMask such that MetaMask is on tab 0 and
   * tab 1 is commonwealth.im
   * @param driver A web driver instance with tab 0 being a newly injected MetaMask instance
   */
  public async setup(driver: WebDriver) {
    let tabs = await driver.getAllWindowHandles() // TODO: make tab selection dynamic i.e. select tab based on some attribute (metamask) instead of index
    await driver.switchTo().window(tabs[0])
    await driver.findElement(this.metaMaskGetStartedBtn).click();
    await driver.findElement(this.importWalletBtn).click();
    await driver.findElement(this.noThanksBtn).click();
    await driver.findElement(this.recoveryPhraseInput).sendKeys(this.recoveryPhrase)
    await driver.findElement(this.newPasswordOne).sendKeys(this.password);
    await driver.findElement(this.newPasswordTwo).sendKeys(this.password);
    await driver.findElement(this.termsCheckBox).click();
    await driver.findElement(this.finalImportBtn).click();
    await driver.findElement(this.allDoneBtn).click();
    await driver.findElement(this.whatsNew).click();
    tabs = await driver.getAllWindowHandles()
    // this.tabHandles['metamask'] = tabs[0]
    // this.tabHandles['cw'] = tabs[1]
    await driver.switchTo().window(tabs[1])
  }

  /**
   * Used to approve/sign a transaction initiated elsewhere
   * @param driver A web driver instance with the metamask extension open and ready to sign a txn
   */
  public async signTxn(driver: WebDriver) {}

}
