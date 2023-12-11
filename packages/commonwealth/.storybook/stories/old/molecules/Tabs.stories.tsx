import React, { FC, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { CWTab, CWTabsRow } from '../../../../client/scripts/views/components/component_kit/new_designs/CWTabs';
import { argsObj } from '../../helpers';

const tabs = {
  title: 'Old/Molecules/Tabs',
  component: CWTab,
} satisfies Meta<typeof CWTab>;

export default tabs;
type Story = StoryObj<any>;

const labels: string[] = [
  "A tab",
  "Another tab",
  "Yet another tab",
];

const Tabs: FC = (args) => {
  const [selectedTab, setSelectedTab] = useState<number>(1);

  return (
    <CWTabsRow>
      {Object.entries(args).map((label: any, i) => (
        <CWTab
          key={label+i}
          label={label[1]}
          onClick={() => setSelectedTab(i+1)}
          isSelected={selectedTab === i+1}
        />
      ))}
    </CWTabsRow>
  )
};

export const Tab: Story = {
  name: 'Tabs',
  args: argsObj("Tab", labels),
  parameters: {
    controls: {
      exclude: [
        "disabled",
        "isSelected",
        "label",
        "onClick"
      ],
    },
  },
  render: ({...args}) => <Tabs {...args} />
};
