import BN from 'bn.js';
import type { ICosmosProposal } from 'controllers/chain/cosmos/types';
import { CosmosToken } from 'controllers/chain/cosmos/types';
import { CommunityPoolSpendProposal } from 'cosmjs-types/cosmos/distribution/v1beta1/distribution';
import { Any } from 'common-common/src/cosmos-ts/src/codegen/google/protobuf/any';

import type { ITXModalData } from 'models/interfaces';
import ProposalModule from 'models/ProposalModule';
import type CosmosAccount from '../../account';
import type CosmosAccounts from '../../accounts';
import type CosmosChain from '../../chain';
import type { CosmosApiType } from '../../chain';
import { CosmosProposalV1 } from './proposal-v1';
import { numberToLong } from 'common-common/src/cosmos-ts/src/codegen/helpers';
import { encodeMsgSubmitProposal } from '../v1beta1/utils-v1beta1';
import { propToIProposal } from './utils-v1';
import {
  DepositParamsQueryResponse,
  TallyParamsQueryResponse,
  VotingParamsQueryResponse,
} from '../types';

/** This file is a copy of controllers/chain/cosmos/governance.ts, modified for
 * gov module version v1. This is considered a patch to make sure v1-enabled chains
 * load proposals. Eventually we will ideally move back to one governance.ts file.
 * Patch state:
 *
 * - governance.ts uses cosmJS v1beta1 gov
 * - governance-v1.ts uses telescope-generated v1 gov  */
class CosmosGovernanceV1 extends ProposalModule<
  CosmosApiType,
  ICosmosProposal,
  CosmosProposalV1
> {
  private _votingPeriodS: number;
  private _yesThreshold: number;
  private _vetoThreshold: number;
  private _maxDepositPeriodS: number;
  private _minDeposit: CosmosToken;

  public get vetoThreshold() {
    return this._vetoThreshold;
  }

  public get minDeposit() {
    return this._minDeposit;
  }

  private _Chain: CosmosChain;
  private _Accounts: CosmosAccounts;

  public async init(
    ChainInfo: CosmosChain,
    Accounts: CosmosAccounts
  ): Promise<void> {
    this._Chain = ChainInfo;
    this._Accounts = Accounts;
    this._initialized = true;
  }

  public async getProposal(proposalId: number): Promise<CosmosProposalV1> {
    const existingProposal = this.store.getByIdentifier(proposalId);
    if (existingProposal) {
      return existingProposal;
    }
    const { proposal } = await this._Chain.lcd.cosmos.gov.v1.proposal({
      proposalId: numberToLong(proposalId),
    });
    const cosmosProp = new CosmosProposalV1(
      this._Chain,
      this._Accounts,
      this,
      propToIProposal(proposal)
    );
    await cosmosProp.init();
    return cosmosProp;
  }

  private async _initProposal(proposalId: number): Promise<void> {
    try {
      if (!proposalId) return;
      const { proposal } = await this._Chain.lcd.cosmos.gov.v1.proposal({
        proposalId: numberToLong(proposalId),
      });
      const cosmosProposal = new CosmosProposalV1(
        this._Chain,
        this._Accounts,
        this,
        propToIProposal(proposal)
      );
      await cosmosProposal.init();
    } catch (error) {
      console.error('Error fetching proposal: ', error);
    }
  }

  public async fetchDepositParams(): Promise<DepositParamsQueryResponse> {
    try {
      const { deposit_params } = await this._Chain.lcd.cosmos.gov.v1.params({
        paramsType: 'deposit',
      });
      this._maxDepositPeriodS = +deposit_params?.max_deposit_period.replace(
        's',
        ''
      );

      // TODO: support off-denom deposits
      const depositCoins = deposit_params?.min_deposit.find(
        ({ denom }) => denom === this._Chain.denom
      );
      if (depositCoins) {
        this._minDeposit = new CosmosToken(
          depositCoins.denom,
          new BN(depositCoins.amount)
        );
      } else {
        console.error(
          'Gov minDeposit in wrong denom:',
          deposit_params?.min_deposit
        );
        this._minDeposit = new CosmosToken(this._Chain.denom, 0);
      }
      console.log(this._minDeposit);
      return {
        minDeposit: this._minDeposit,
        maxDepositPeriodS: this._maxDepositPeriodS,
      };
    } catch (e) {
      console.error('Error fetching deposit params', e);
    }
  }

  public async fetchTallyThresholds(): Promise<TallyParamsQueryResponse> {
    try {
      const { tally_params } = await this._Chain.lcd.cosmos.gov.v1.params({
        paramsType: 'tallying',
      });
      this._yesThreshold = +tally_params?.threshold;
      this._vetoThreshold = +tally_params?.veto_threshold;
      return {
        yesThreshold: this._yesThreshold,
        vetoThreshold: this._vetoThreshold,
      };
    } catch (e) {
      console.error('Error fetching tally params', e);
    }
  }

  public async fetchVotingPeriod(): Promise<VotingParamsQueryResponse> {
    try {
      const { voting_params } = await this._Chain.lcd.cosmos.gov.v1.params({
        paramsType: 'voting',
      });
      this._votingPeriodS = +voting_params.voting_period.replace('s', '');
      return { votingPeriodS: this._votingPeriodS };
    } catch (e) {
      console.error('Error fetching voting params', e);
    }
  }

  public createTx(
    sender: CosmosAccount,
    title: string,
    description: string,
    initialDeposit: CosmosToken,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    memo = ''
  ): ITXModalData {
    throw new Error('unsupported');
  }

  // TODO: support multiple amount types
  public encodeCommunitySpend(
    title: string,
    description: string,
    recipient: string,
    amount: string
  ): Any {
    const denom = this._minDeposit.denom;
    const coinAmount = [{ amount, denom }];
    const spend = CommunityPoolSpendProposal.fromPartial({
      title,
      description,
      recipient,
      amount: coinAmount,
    });
    const prop = CommunityPoolSpendProposal.encode(spend).finish();
    return Any.fromPartial({
      typeUrl: '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal',
      value: prop,
    });
  }

  // TODO: support multiple deposit types
  public async submitProposalTx(
    sender: CosmosAccount,
    initialDeposit: CosmosToken,
    content: Any
  ): Promise<number> {
    const msg = encodeMsgSubmitProposal(
      sender.address,
      initialDeposit,
      content
    );

    // fetch completed proposal from returned events
    const events = await this._Chain.sendTx(sender, msg);
    console.log(events);
    const submitEvent = events?.find((e) => e.type === 'submit_proposal');
    const cosm = await import('@cosmjs/encoding');
    const idAttribute = submitEvent?.attributes.find(
      ({ key }) => key && cosm.fromAscii(key) === 'proposal_id'
    );
    const id = +cosm.fromAscii(idAttribute.value);
    await this._initProposal(id);
    return id;
  }
}

export default CosmosGovernanceV1;
