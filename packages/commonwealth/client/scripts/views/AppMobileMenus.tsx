import React from 'react';

import { CreateContentMenu } from './menus/create_content_menu';
import { HelpMenu } from './menus/help_menu';
import { MainMenu } from './menus/main_menu';
import { NotificationsMenu } from './menus/notifications_menu';
import useSidebarStore from 'state/ui/sidebar';
import { MobileMenu } from './menus/mobile_menu';

const mobileMenuLookup = {
  CreateContentMenu,
  HelpMenu,
  MainMenu,
  NotificationsMenu,
  MobileMenu,
};

export type MobileMenuName = keyof typeof mobileMenuLookup;

export const AppMobileMenus = () => {
  const { mobileMenuName } = useSidebarStore();

  const ActiveMenu = mobileMenuLookup[mobileMenuName];

  return <ActiveMenu />;
};
