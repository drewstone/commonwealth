/* @jsx m */

import m from 'mithril';
import ClassComponent from 'class_component';

import 'pages/new_proposal/aave_proposal_form.scss';

import app from 'state';
import { Account } from 'models';
import { Executor } from 'common-common/src/eth/types';
import User from 'views/components/widgets/user';
import Aave from 'controllers/chain/ethereum/aave/adapter';
import { CWTab, CWTabBar } from '../../components/component_kit/cw_tabs';
import { CWLabel } from '../../components/component_kit/cw_label';
import { CWTextInput } from '../../components/component_kit/cw_text_input';
import { CWButton } from '../../components/component_kit/cw_button';
import { CWPopoverMenu } from '../../components/component_kit/cw_popover/cw_popover_menu';
import { CWIconButton } from '../../components/component_kit/cw_icon_button';
import { CWText } from '../../components/component_kit/cw_text';

type AaveProposalFormAttrs = {
  author: Account;
};

type AaveProposalState = {
  calldata?: string;
  signature?: string;
  target?: string;
  value?: string;
  withDelegateCall: boolean;
};

export class AaveProposalForm extends ClassComponent<AaveProposalFormAttrs> {
  private aaveProposalState: Array<AaveProposalState>;
  private activeTabIndex: number;
  private executor: Executor | string;
  private ipfsHash: string;
  private tabCount: number;

  oninit() {
    this.aaveProposalState = [
      {
        target: undefined,
        value: undefined,
        calldata: undefined,
        signature: undefined,
        withDelegateCall: false,
      },
    ];
    this.activeTabIndex = 0;
    this.tabCount = 1;
  }

  view(vnode: m.Vnode<AaveProposalFormAttrs>) {
    const { author } = vnode.attrs;
    const { activeTabIndex, aaveProposalState } = this;

    return (
      <div class="AaveProposalForm">
        <div class="row-with-label">
          <CWLabel label="Proposer (you)" />
          {m(User, {
            user: author,
            linkify: true,
            popover: true,
            showAddressWithDisplayName: true,
          })}
        </div>
        <CWTextInput
          label="IPFS Hash"
          placeholder="Proposal IPFS Hash"
          oninput={(e) => {
            const result = (e.target as any).value;
            this.ipfsHash = result;
            m.redraw();
          }}
        />
        <div class="row-with-label">
          <CWLabel label="Executor" />
          <div class="executors-container">
            {(app.chain as Aave).governance.api.Executors.map((r) => (
              <div
                class={`executor ${
                  this.executor === r.address && 'selected-executor'
                }`}
                onclick={() => {
                  this.executor = r.address;
                }}
              >
                <div class="executor-row">
                  <CWText fontWeight="medium">Address</CWText>
                  <CWText type="caption">{r.address}</CWText>
                </div>
                <div class="executor-row">
                  <CWText fontWeight="medium">Time Delay</CWText>
                  <CWText type="caption">
                    {r.delay / (60 * 60 * 24)} Day(s)
                  </CWText>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="tab-selector">
          <CWTabBar>
            {aaveProposalState.map((_, index) => (
              <CWTab
                label={`Call ${index + 1}`}
                isSelected={activeTabIndex === index}
                onclick={() => {
                  this.activeTabIndex = index;
                }}
              />
            ))}
          </CWTabBar>
          <CWPopoverMenu
            menuItems={[
              {
                iconLeft: 'write',
                label: 'Add',
                onclick: () => {
                  this.tabCount++;
                  this.activeTabIndex = this.tabCount - 1;
                  this.aaveProposalState.push({
                    target: null,
                    value: null,
                    calldata: null,
                    signature: null,
                    withDelegateCall: false,
                  });
                },
              },
              {
                iconLeft: 'trash',
                label: 'Delete',
                disabled: this.activeTabIndex === 0,
                onclick: () => {
                  this.tabCount--;
                  this.activeTabIndex = this.tabCount - 1;
                  this.aaveProposalState.pop();
                },
              },
            ]}
            trigger={<CWIconButton iconName="plus" />}
          />
        </div>
        <CWTextInput
          label="Target Address"
          placeholder="Add Target"
          value={aaveProposalState[activeTabIndex].target}
          oninput={(e) => {
            const result = (e.target as any).value;
            this.aaveProposalState[activeTabIndex].target = result;
            m.redraw();
          }}
        />
        <CWTextInput
          label="Value"
          placeholder="Enter amount in wei"
          value={aaveProposalState[activeTabIndex].value}
          oninput={(e) => {
            const result = (e.target as any).value;
            this.aaveProposalState[activeTabIndex].value = result;
            m.redraw();
          }}
        />
        <CWTextInput
          label="Calldata"
          placeholder="Add Calldata"
          value={aaveProposalState[activeTabIndex].calldata}
          oninput={(e) => {
            const result = (e.target as any).value;
            this.aaveProposalState[activeTabIndex].calldata = result;
            m.redraw();
          }}
        />
        <CWTextInput
          label="Function Signature (Optional)"
          placeholder="Add a signature"
          value={aaveProposalState[activeTabIndex].signature}
          oninput={(e) => {
            const result = (e.target as any).value;
            this.aaveProposalState[activeTabIndex].signature = result;
            m.redraw();
          }}
        />
        <div class="delegate-call-container">
          <CWLabel label="Delegate Call" />
          <div class="buttons-row">
            <CWButton
              label="TRUE"
              // class: `button ${
              //   aaveProposalState[activeAaveTabIndex].withDelegateCall ===
              //     true && 'active'
              // }`,
              onclick={() => {
                this.aaveProposalState[activeTabIndex].withDelegateCall = true;
              }}
            />
            <CWButton
              label="FALSE"
              // class: `ml-12 button ${
              //   aaveProposalState[activeAaveTabIndex].withDelegateCall ===
              //     false && 'active'
              // }`,
              onclick={() => {
                this.aaveProposalState[activeTabIndex].withDelegateCall = false;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
