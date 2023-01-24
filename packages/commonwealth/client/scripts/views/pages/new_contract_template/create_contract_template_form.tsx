/* @jsx m */
import m from 'mithril';
import ClassComponent from 'class_component';

import 'pages/new_contract_template/create_contract_template_form.scss';

import { notifyError } from 'controllers/app/notifications';
import { CWButton } from 'views/components/component_kit/cw_button';
import { CWDivider } from 'views/components/component_kit/cw_divider';
import { CWTextInput } from 'views/components/component_kit/cw_text_input';
import { CWTextArea } from 'views/components/component_kit/cw_text_area';
import { CWText } from 'views/components/component_kit/cw_text';

class CreateContractTemplateForm extends ClassComponent {
  private saving = false;
  private form = {
    displayName: '',
    nickname: '',
    template: '',
  };

  createContractTemplate() {
    try {
      this.saving = true;
      console.log(this.form);
    } catch (err) {
      notifyError('Failed to create new contract template');
      console.log(err);
    } finally {
      this.saving = false;
    }
  }

  resetForm() {
    this.form.displayName = '';
    this.form.nickname = '';
    this.form.template = '';
  }

  view() {
    const isCreatingDisabled =
      this.saving ||
      !this.form.displayName ||
      !this.form.nickname ||
      !this.form.template;

    return (
      <div class="CreateContractTemplateForm">
        <div class="form">
          <CWText type="caption" fontWeight="medium" className="input-label">
            Display Name
          </CWText>
          <CWTextInput
            label="An official name to identify this kind of template"
            value={this.form.displayName}
            placeholder="Enter display name"
            oninput={(e) => {
              this.form.displayName = e.target.value;
            }}
          />
          <CWText type="caption" fontWeight="medium" className="input-label">
            Nickname
          </CWText>
          <CWTextInput
            label="A name that your community can easily remember and identify"
            value={this.form.nickname}
            placeholder="Enter nickname"
            oninput={(e) => {
              this.form.nickname = e.target.value;
            }}
          />
          <CWText type="caption" fontWeight="medium" className="input-label">
            JSON Blob
          </CWText>
          <CWTextArea
            value={this.form.template}
            placeholder="Enter relevant JSON Blob"
            oninput={(e) => {
              this.form.template = e.target.value;
            }}
          />
        </div>

        <CWDivider className="divider" />

        <div class="buttons">
          <CWButton
            buttonType="mini-white"
            label="Cancel"
            onclick={() => this.resetForm()}
          />
          <CWButton
            buttonType="mini-black"
            label="Create"
            disabled={isCreatingDisabled}
            onclick={() => this.createContractTemplate()}
          />
        </div>
      </div>
    );
  }
}

export default CreateContractTemplateForm;
