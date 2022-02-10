import { ChainBase } from 'types';
import { Account, IWebWallet } from 'models';
import app from 'state';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { setActiveAccount } from 'controllers/app/login';
import { constructTypedMessage } from 'adapters/chain/ethereum/keys';

class WalletConnectWebWalletController implements IWebWallet<string> {
  private _enabled: boolean;
  private _enabling = false;
  private _accounts: string[];
  private _provider: WalletConnectProvider;
  private _web3: Web3;

  public readonly name = 'walletconnect';
  public readonly label = 'WalletConnect';
  public readonly chain = ChainBase.Ethereum;
  public readonly available = true;

  public get provider() {
    return this._provider;
  }

  public get enabled() {
    return this.available && this._enabled;
  }

  public get enabling() {
    return this._enabling;
  }

  public get accounts() {
    return this._accounts || [];
  }

  public async signMessage(message: string): Promise<string> {
    const signature = await this._web3.eth.sign(message, this.accounts[0]);
    return signature;
  }

  public async signLoginToken(message: string): Promise<string> {
    const msgParams = constructTypedMessage(app.chain.meta.ethChainId || 1, message);
    const signature = await this._provider.wc.signTypedData([
      this.accounts[0],
      JSON.stringify(msgParams),
    ]);
    return signature;
  }

  public async validateWithAccount(account: Account<any>): Promise<void> {
    // TODO: test whether signTypedData works on WC
    const webWalletSignature = await this.signLoginToken(account.validationToken);
    return account.validate(webWalletSignature);
  }

  public async enable() {
    console.log('Attempting to enable WalletConnect');
    this._enabling = true;
    try {
      // Create WalletConnect Provider
      const chainId = app.chain?.meta.ethChainId || 1;

      // use alt wallet url if available
      const rpc = { [chainId]: app.chain.meta.altWalletUrl || app.chain.meta.url };
      console.log(rpc);
      this._provider = new WalletConnectProvider({ rpc, chainId });

      //  Enable session (triggers QR Code modal)
      await this._provider.enable();
      this._web3 = new Web3(this._provider as any);
      this._accounts = await this._web3.eth.getAccounts();
      if (this._accounts.length === 0) {
        throw new Error('WalletConnect fetched no accounts.');
      }

      this._initSubscriptions();
      this._enabled = true;
      this._enabling = false;
    } catch (error) {
      this._enabling = false;
      throw new Error(`Failed to enable WalletConnect: ${error.message}`);
    }
  }

  private _accountsChangedHandler: (accounts: string[]) => Promise<void>;
  private _chainChangedHandler: (chainId: string | number) => void;
  private _initSubscriptions() {
    this._accountsChangedHandler = async (accounts: string[]) => {
      console.log(`Walletconnect accounts changed to ${accounts}...`);
      const updatedAddress = app.user.activeAccounts.find((addr) => addr.address === accounts[0]);
      if (updatedAddress) {
        await setActiveAccount(updatedAddress);
      }
      this._accounts = accounts;
    };

    this._chainChangedHandler = (chainId) => {
      console.log(`Walletconnect chain changed to ${chainId}, reloading...`);
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    };

    this._web3.givenProvider.on('accountsChanged', this._accountsChangedHandler);
    this._web3.givenProvider.on('chainChanged', this._chainChangedHandler);
    this._provider.on('disconnect', this.disable.bind(this));
  }

  public async disable() {
    if (this._provider.connected) {
      this._provider.disconnect();
    }
    if (this._accountsChangedHandler) {
      this._web3.givenProvider.removeListener('accountsChanged', this._accountsChangedHandler);
      this._accountsChangedHandler = null;
    }
    if (this._chainChangedHandler) {
      this._web3.givenProvider.removeListener('chainChanged', this._chainChangedHandler);
      this._chainChangedHandler = null;
    }
    this._enabling = false;
    this._enabled = false;
  }
}

export default WalletConnectWebWalletController;
