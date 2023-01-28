import type { SubstrateCoin } from 'adapters/chain/substrate/types';
import { ChainBase } from 'common-common/src/types';
import type { SubstrateAccount } from 'controllers/chain/substrate/account';
import SubstrateAccounts from 'controllers/chain/substrate/account';
import SubstrateBountyTreasury from 'controllers/chain/substrate/bountyTreasury';
import {
  SubstrateCouncil,
  SubstrateTechnicalCommittee,
} from 'controllers/chain/substrate/collective';
import SubstrateDemocracy from 'controllers/chain/substrate/democracy';
import SubstrateDemocracyProposals from 'controllers/chain/substrate/democracy_proposals';
import SubstrateTreasury from 'controllers/chain/substrate/treasury';
import type { ChainInfo } from 'models';
import { IChainAdapter } from 'models';
import type { IApp } from 'state';
import SubstrateIdentities from './identities';
import SubstratePhragmenElections from './phragmen_elections';
import SubstrateChain from './shared';
import SubstrateTreasuryTips from './treasury_tips';

class Substrate extends IChainAdapter<SubstrateCoin, SubstrateAccount> {
  public chain: SubstrateChain;
  public accounts: SubstrateAccounts;
  public phragmenElections: SubstratePhragmenElections;
  public council: SubstrateCouncil;
  public technicalCommittee: SubstrateTechnicalCommittee;
  public democracyProposals: SubstrateDemocracyProposals;
  public democracy: SubstrateDemocracy;
  public treasury: SubstrateTreasury;
  public bounties: SubstrateBountyTreasury;
  public identities: SubstrateIdentities;
  public tips: SubstrateTreasuryTips;

  public readonly base = ChainBase.Substrate;

  public get timedOut() {
    console.log(this.chain);
    return !!this.chain?.timedOut;
  }

  constructor(meta: ChainInfo, app: IApp) {
    super(meta, app);
    this.chain = new SubstrateChain(this.app);
    this.accounts = new SubstrateAccounts(this.app);
    this.phragmenElections = new SubstratePhragmenElections(this.app);
    this.council = new SubstrateCouncil(this.app);
    this.technicalCommittee = new SubstrateTechnicalCommittee(this.app);
    this.democracyProposals = new SubstrateDemocracyProposals(this.app);
    this.democracy = new SubstrateDemocracy(this.app);
    this.treasury = new SubstrateTreasury(this.app);
    this.bounties = new SubstrateBountyTreasury(this.app);
    this.tips = new SubstrateTreasuryTips(this.app);
    this.identities = new SubstrateIdentities(this.app);
  }

  public async initApi(additionalOptions?) {
    if (this.apiInitialized) return;
    await this.chain.resetApi(
      this.meta,
      additionalOptions || this.meta.substrateSpec
    );
    await this.chain.initMetadata();
    await this.accounts.init(this.chain);
    await this.identities.init(this.chain, this.accounts);
    await super.initApi();
  }

  public async initData() {
    await this.chain.initChainEntities();
    await this.chain.initEventLoop();
    await super.initData();
  }

  public async deinit(): Promise<void> {
    await super.deinit();
    this.chain.deinitEventLoop();
    await Promise.all(
      [
        this.phragmenElections,
        this.council,
        this.technicalCommittee,
        this.democracyProposals,
        this.democracy,
        this.treasury,
        this.bounties,
        this.tips,
        this.identities,
      ].map((m) => (m.initialized ? m.deinit() : Promise.resolve()))
    );
    this.accounts.deinit();
    this.chain.deinitMetadata();
    await this.chain.deinitApi();
    console.log('Substrate stopped.');
  }
}

export default Substrate;
