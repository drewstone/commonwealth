export const enum MixpanelPageViewEvent {
  LANDING_PAGE_VIEW = 'Landing Page Viewed',
  COMMUNITY_CREATION_PAGE_VIEW = 'Create Community Page Viewed',
  THREAD_PAGE_VIEW = 'Thread Page Viewed',
  DASHBOARD_VIEW = 'Dashbboard Page Viewed',
  MEMBERS_PAGE_VIEW = 'Members Page Viewed',
  GROUPS_PAGE_VIEW = 'Groups Page Viewed',
  GROUPS_CREATION_PAGE_VIEW = 'Create Group Page Viewed',
  GROUPS_EDIT_PAGE_VIEW = 'Edit Group Page Viewed',
}

export const enum MixpanelCommunityInteractionEvent {
  CREATE_THREAD = 'Create New Thread',
  CREATE_COMMENT = 'Create New Comment',
  CREATE_REACTION = 'Create New Reaction',
  CREATE_GROUP = 'Create New Group',
  LINKED_PROPOSAL = 'Linked Proposal',
  LINKED_THREAD = 'Linked Thread',
  UPDATE_STAGE = 'Update Stage',
  UPDATE_GROUP = 'Update Group',
}

export const enum MixpanelLoginEvent {
  LOGIN = 'Login',
  LOGIN_COMPLETED = 'Login Completed',
  LOGIN_FAILED = 'Login Failed',
}

export const enum MixpanelUserSignupEvent {
  NEW_USER_SIGNUP = 'New User Signup',
}

export const enum MixpanelErrorCaptureEvent {
  ERROR_CAPTURED = 'Error Event Captured',
}

export const enum MixpanelClickthroughEvent {
  VIEW_THREAD_TO_MEMBERS_PAGE = 'Clickthrough: View Thread to Members Page -> Groups Tab',
}

export const enum MixpanelCommunityCreationEvent {
  CREATE_BUTTON_PRESSED = 'Create Community Button Pressed',
  COMMUNITY_TYPE_CHOSEN = 'Create Community Type Chosen',
  CHAIN_SELECTED = 'Create Community Chain Selected',
  ADDRESS_ADDED = 'Create Community Address Added',
  WEBSITE_ADDED = 'Create Community Website Added',
  NEW_COMMUNITY_CREATION = 'New Community Creation',
  CREATE_COMMUNITY_ATTEMPTED = 'Create Community Attempted',
}

export const enum MixpanelSnapshotEvents {
  SNAPSHOT_PAGE_VISIT = 'Snapshot Page Visited',
  SNAPSHOT_PROPOSAL_VIEWED = 'Snapshot Proposal Viewed',
  SNAPSHOT_VOTE_OCCURRED = 'Snapshot Vote Occurred',
  SNAPSHOT_PROPOSAL_CREATED = 'Snapshot Proposal Created',
}

export type MixpanelEvents =
  | MixpanelLoginEvent
  | MixpanelUserSignupEvent
  | MixpanelCommunityCreationEvent
  | MixpanelPageViewEvent
  | MixpanelCommunityInteractionEvent
  | MixpanelSnapshotEvents
  | MixpanelErrorCaptureEvent
  | MixpanelClickthroughEvent;

export type AnalyticsEvent = MixpanelEvents; // add other providers events here

export interface AnalyticsPayload {
  event: AnalyticsEvent; // base event type
}

export interface BaseMixpanelPayload extends AnalyticsPayload {
  event: MixpanelEvents;
  userAddress?: string;
  community?: string;
  communityType?: string;
  userId?: number;
}

export interface MixpanelLoginPayload extends BaseMixpanelPayload {
  loginOption: string;
  isSocialLogin: boolean;
  loginPageLocation: string;
  isMobile: boolean;
}

export type MixpanelClickthroughPayload = BaseMixpanelPayload;

export const providers = ['mixpanel']; // add other providers here
