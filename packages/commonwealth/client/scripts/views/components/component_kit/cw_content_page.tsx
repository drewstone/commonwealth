/* @jsx jsx */
import React from 'react';

import {
  ClassComponent,
  ResultNode,
  render,
  setRoute,
  getRoute,
  getRouteParam,
  redraw,
  Component,
  jsx,
} from 'mithrilInterop';
import moment from 'moment';

import 'components/component_kit/cw_content_page.scss';

import { pluralize } from 'helpers';
import { ComponentType } from './types';
import { CWTabBar, CWTab } from './cw_tabs';
import { CWText } from './cw_text';
import { PopoverMenu, PopoverMenuItem } from './cw_popover/cw_popover_menu';
import { CWIconButton } from './cw_icon_button';
import { isWindowMediumSmallInclusive } from './helpers';
import { CWIcon } from './cw_icons/cw_icon';
import { SharePopover } from '../share_popover';
import { CWCard } from './cw_card';
import { CWIconButton } from './cw_icon_button';
import { CWIcon } from './cw_icons/cw_icon';
import { CWPopoverMenu } from './cw_popover/cw_popover_menu';
import { CWTab, CWTabBar } from './cw_tabs';
import { CWText } from './cw_text';
import { isWindowMediumSmallInclusive } from './helpers';
import type { MenuItem } from './types';
import { ComponentType } from './types';

export type ContentPageSidebarItem = {
  label: string;
  item: ResultNode;
};

// tuple
export type SidebarComponents = [
  item?: ContentPageSidebarItem,
  item?: ContentPageSidebarItem,
  item?: ContentPageSidebarItem
];

type ContentPageAttrs = {
  createdAt: moment.Moment | number;
  title: string | ResultNode;

  // optional
  author?: ResultNode;
  actions?: Array<PopoverMenuItem>;
  body?: ResultNode;
  comments?: ResultNode;
  contentBodyLabel?: 'Snapshot' | 'Thread'; // proposals don't need a label because they're never tabbed
  headerComponents?: ResultNode;
  readOnly?: boolean;
  showSidebar?: boolean;
  sidebarComponents?: SidebarComponents;
  subBody?: ResultNode;
  subHeader?: ResultNode;
  viewCount?: number;
};

export class CWContentPage extends ClassComponent<ContentPageAttrs> {
  private viewType: 'sidebarView' | 'tabsView';
  private tabSelected: number;

  onResize(vnode: ResultNode<ContentPageAttrs>) {
    this.viewType =
      isWindowMediumSmallInclusive(window.innerWidth) && vnode.attrs.showSidebar
        ? 'tabsView'
        : 'sidebarView';

    this.redraw();
  }

  oninit(vnode: ResultNode<ContentPageAttrs>) {
    this.viewType =
      isWindowMediumSmallInclusive(window.innerWidth) && vnode.attrs.showSidebar
        ? 'tabsView'
        : 'sidebarView';

    if (vnode.attrs.sidebarComponents?.length > 0) {
      this.tabSelected = 0;
    }

    window.addEventListener('resize', () => {
      this.onResize(vnode);
    });
  }

  onremove(vnode: ResultNode<ContentPageAttrs>) {
    window.removeEventListener('resize', () => {
      this.onResize(vnode);
    });
  }

  view(vnode: ResultNode<ContentPageAttrs>) {
    const {
      actions,
      author,
      body,
      comments,
      contentBodyLabel,
      createdAt,
      headerComponents,
      readOnly,
      showSidebar,
      sidebarComponents,
      subBody,
      subHeader,
      title,
      viewCount,
    } = vnode.attrs;

    const mainBody = (
      <div className="main-body-container">
        <div className="header">
          {typeof title === 'string' ? (
            <CWText type="h3" fontWeight="semiBold">
              {title}
            </CWText>
          ) : (
            title
          )}
          <div className="header-info-row">
            {author}
            {typeof createdAt === 'number' ||
              (moment.isMoment(createdAt) && createdAt.isValid() && (
                <CWText type="caption" className="header-text">
                  published on {moment(createdAt).format('l')}
                </CWText>
              ))}
            {!!viewCount && (
              <CWText type="caption" className="header-text">
                {pluralize(viewCount, 'view')}
              </CWText>
            )}
            {headerComponents}
            {readOnly && <CWIcon iconName="lock" iconSize="small" />}
            {actions && (
              <PopoverMenu
                renderTrigger={(onclick) => (
                  <CWIconButton
                    iconName="dotsVertical"
                    iconSize="small"
                    onClick={onclick}
                  />
                )}
                menuItems={actions}
              />
            )}
            <SharePopover />
          </div>
        </div>
        {subHeader}
        {body}
        {subBody}
        {comments}
      </div>
    );

    return (
      <div className={ComponentType.ContentPage}>
        {this.viewType === 'sidebarView' && (
          <div className="sidebar-view">
            {mainBody}
            {showSidebar && (
              <div className="sidebar">
                {sidebarComponents.map((c) => c.item)}
              </div>
            )}
          </div>
        )}
        {this.viewType === 'tabsView' && (
          <div className="tabs-view">
            <CWTabBar>
              <CWTab
                label={contentBodyLabel}
                onClick={() => {
                  this.tabSelected = 0;
                }}
                isSelected={this.tabSelected === 0}
              />
              {sidebarComponents.map((item, i) => (
                <CWTab
                  label={item.label}
                  onClick={() => {
                    this.tabSelected = i + 1;
                  }}
                  isSelected={this.tabSelected === i + 1}
                />
              ))}
            </CWTabBar>
            {this.tabSelected === 0 && mainBody}
            {sidebarComponents.length >= 1 &&
              this.tabSelected === 1 &&
              sidebarComponents[0].item}
            {sidebarComponents.length >= 2 &&
              this.tabSelected === 2 &&
              sidebarComponents[1].item}
            {sidebarComponents.length === 3 &&
              this.tabSelected === 3 &&
              sidebarComponents[2].item}
          </div>
        )}
      </div>
    );
  }
}

type ContentPageCardAttrs = {
  content: ResultNode;
  header: string;
};

export class CWContentPageCard extends ClassComponent<ContentPageCardAttrs> {
  view(vnode: ResultNode<ContentPageCardAttrs>) {
    const { content, header } = vnode.attrs;

    return (
      <CWCard className="ContentPageCard">
        <div className="header-container">
          <CWText type="h5" fontWeight="semiBold">
            {header}
          </CWText>
        </div>
        {content}
      </CWCard>
    );
  }
}
