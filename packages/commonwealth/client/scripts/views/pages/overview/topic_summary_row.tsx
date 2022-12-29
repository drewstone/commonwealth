/* @jsx jsx */


import { ClassComponent, ResultNode, render, setRoute, getRoute, getRouteParam, redraw, Component, jsx } from 'mithrilInterop';
import moment from 'moment';

import 'pages/overview/topic_summary_row.scss';

import app from 'state';
// import { navigateToSubpage } from 'app';
import { Thread, Topic } from 'models';
import { getProposalUrlPath } from 'identifiers';
import { slugify } from 'utils';
import { CWText } from '../../components/component_kit/cw_text';
import User from '../../components/widgets/user';
import { CWIcon } from '../../components/component_kit/cw_icons/cw_icon';
import { CWDivider } from '../../components/component_kit/cw_divider';
// import { CWIconButton } from '../../components/component_kit/cw_icon_button';
import { getLastUpdated, isHot } from '../discussions/helpers';
import { SharePopover } from '../../components/share_popover';
// import { CWPopoverMenu } from '../../components/component_kit/cw_popover/cw_popover_menu';
// import { confirmationModalWithText } from '../../modals/confirm_modal';
import { getClasses } from '../../components/component_kit/helpers';

type TopicSummaryRowAttrs = {
  monthlyThreads: Array<Thread>;
  topic: Topic;
};

export class TopicSummaryRow extends ClassComponent<TopicSummaryRowAttrs> {
  view(vnode: ResultNode<TopicSummaryRowAttrs>) {
    const { monthlyThreads, topic } = vnode.attrs;

    const topFiveSortedThreads = monthlyThreads
      .sort((a, b) => {
        const aLastUpdated = a.lastCommentedOn || a.createdAt;
        const bLastUpdated = b.lastCommentedOn || b.createdAt;
        return bLastUpdated.valueOf() - aLastUpdated.valueOf();
      })
      .slice(0, 5);

    // const isAdmin =
    //   app.roles.isRoleOfCommunity({
    //     role: 'admin',
    //     chain: app.activeChainId(),
    //   }) || app.user.isSiteAdmin;

    // const isAdminOrMod =
    //   isAdmin ||
    //   app.roles.isRoleOfCommunity({
    //     role: 'moderator',
    //     chain: app.activeChainId(),
    //   });

    return (
      <div className="TopicSummaryRow">
        <div className="topic-column">
          <div className="name-and-count">
            <CWText
              type="h4"
              fontWeight="semiBold"
              class="topic-name-text"
              onClick={(e) => {
                e.preventDefault();
                setRoute(
                  `/${app.activeChainId()}/discussions/${encodeURI(topic.name)}`
                );
              }}
            >
              {topic.name}
            </CWText>
            <CWText
              type="caption"
              fontWeight="medium"
              class="threads-count-text"
            >
              {monthlyThreads.length} Threads
            </CWText>
          </div>
          {topic.description && <CWText type="b2">{topic.description}</CWText>}
        </div>
        <div className="recent-threads-column">
          {topFiveSortedThreads.map((thread, idx) => {
            const discussionLink = getProposalUrlPath(
              thread.slug,
              `${thread.identifier}-${slugify(thread.title)}`
            );

            const user = app.chain.accounts.get(thread.author);
            // const commentsCount = app.comments.nComments(thread);

            return (
              <>
                <div
                  className={getClasses<{ isPinned?: boolean }>(
                    { isPinned: thread.pinned },
                    'recent-thread-row'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRoute(discussionLink);
                  }}
                >
                  <div className="row-top">
                    <div className="user-and-date-row">
                      {render(User, {
                        user,
                        showAddressWithDisplayName: true,
                        avatarSize: 24,
                        linkify: true,
                      })}
                      <CWText class="last-updated-text">•</CWText>
                      <CWText
                        type="caption"
                        fontWeight="medium"
                        class="last-updated-text"
                      >
                        {moment(getLastUpdated(thread)).format('l')}
                      </CWText>
                      {thread.readOnly && (
                        <CWIcon iconName="lock" iconSize="small" />
                      )}
                    </div>
                    <div className="row-top-icons">
                      {isHot(thread) && <div className="flame" />}
                      {thread.pinned && <CWIcon iconName="pin" />}
                    </div>
                  </div>
                  <CWText type="b2" fontWeight="bold">
                    {thread.title}
                  </CWText>
                  <div class="row-bottom">
                    <div class="comments-and-users">
                      <CWText type="caption" className="thread-preview">
                        {thread.plaintext}
                      </CWText>
                      {/* TODO Gabe 12/7/22 - Comment count isn't available before the comments store is initialized */}
                      {/* <div className="comments-count">
                        <CWIcon iconName="feedback" iconSize="small" />
                        <CWText type="caption">{commentsCount} comments</CWText>
                      </div> */}
                      {/* TODO Gabe 10/3/22 - user gallery blocked by changes to user model */}
                      {/* <div className="user-gallery">
                        <div className="avatars-row">
                          {gallery.map((u) => u.profile.getAvatar(16))}
                        </div>
                        <CWText type="caption">+4 others</CWText>
                      </div> */}
                    </div>
                    <div className="row-bottom-menu">
                      <div
                        onClick={(e) => {
                          // prevent clicks from propagating to discussion row
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <SharePopover />
                      </div>
                      {/* TODO Gabe 12/7/22 - Commenting out menu until we figure out fetching bug */}
                      {/* {isAdminOrMod && (
                        <div
                          onClick={(e) => {
                            // prevent clicks from propagating to discussion row
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <CWPopoverMenu
                            menuItems={[
                              {
                                label: 'Delete',
                                iconLeft: 'trash',
                                onclick: async (e) => {
                                  e.preventDefault();

                                  const confirmed =
                                    await confirmationModalWithText(
                                      'Delete this entire thread?'
                                    )();

                                  if (!confirmed) return;

                                  app.threads.delete(thread).then(() => {
                                    navigateToSubpage('/overview');
                                  });
                                },
                              },
                              {
                                label: thread.readOnly
                                  ? 'Unlock thread'
                                  : 'Lock thread',
                                iconLeft: 'lock',
                                onclick: (e) => {
                                  e.preventDefault();
                                  app.threads
                                    .setPrivacy({
                                      threadId: thread.id,
                                      readOnly: !thread.readOnly,
                                    })
                                    .then(() => {
                                      redraw();
                                    });
                                },
                              },
                            ]}
                            trigger={
                              <CWIconButton
                                iconSize="small"
                                iconName="dotsVertical"
                              />
                            }
                          />
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
                {idx !== topFiveSortedThreads.length - 1 && <CWDivider />}
              </>
            );
          })}
        </div>
      </div>
    );
  }
}
