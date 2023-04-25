import * as CustomIcons from './cw_custom_icons';
import * as Icons from './cw_icons';

export const iconLookup = {
  arrowLeft: Icons.CWArrowLeft,
  arrowRight: Icons.CWArrowRight,
  backer: Icons.CWBacker,
  badge: Icons.CWBadge,
  bell: Icons.CWBell,
  cautionCircle: Icons.CWCautionCircle,
  cautionTriangle: Icons.CWCautionTriangle,
  check: Icons.CWCheck,
  chevronDown: Icons.CWChevronDown,
  chevronLeft: Icons.CWChevronLeft,
  chevronRight: Icons.CWChevronRight,
  chevronUp: Icons.CWChevronUp,
  clock: Icons.CWClock,
  close: Icons.CWClose,
  cloud: Icons.CWCloud,
  collapse: Icons.CWCollapse,
  commonLogo: Icons.CWCommonLogo,
  compass: Icons.CWCompass,
  copy: Icons.CWCopy,
  cow: Icons.CWCow,
  curator: Icons.CWCurator,
  delegate: Icons.CWDelegate,
  democraticProposal: Icons.CWDemocraticProposal,
  discord: Icons.CWDiscord,
  dots: Icons.CWDots,
  dotsVertical: Icons.CWDotsVertical,
  downvote: Icons.CWDownvote,
  element: Icons.CWElement,
  expand: Icons.CWExpand,
  exploreCommunity: Icons.CWExploreCommunities,
  externalLink: Icons.CWExternalLink,
  feedback: Icons.CWFeedback,
  filter: Icons.CWFilter,
  flag: Icons.CWFlag,
  flame: Icons.CWFlame,
  gear: Icons.CWGear,
  github: Icons.CWGithub,
  hamburger: Icons.CWHamburger,
  hash: Icons.CWHash,
  heartEmpty: Icons.CWHeartEmpty,
  heartFilled: Icons.CWHeartFilled,
  help: Icons.CWHelp,
  home: Icons.CWHome,
  imageUpload: Icons.CWImageUpload,
  infoEmpty: Icons.CWInfoEmpty,
  infoFilled: Icons.CWInfoFilled,
  jar: Icons.CWJar,
  link: Icons.CWLink,
  lock: Icons.CWLock,
  logout: Icons.CWLogout,
  mail: Icons.CWMail,
  mute: Icons.CWMute,
  people: Icons.CWPeople,
  person: Icons.CWPerson,
  pin: Icons.CWPin,
  plus: Icons.CWPlus,
  plusCircle: Icons.CWPlusCircle,
  search: Icons.CWSearch,
  send: Icons.CWSend,
  share: Icons.CWShare,
  share2: Icons.CWShare2,
  sidebarCollapse: Icons.CWSidebarCollapse,
  sidebarExpand: Icons.CWSidebarExpand,
  star: Icons.CWStar,
  sun: Icons.CWSun,
  telegram: Icons.CWTelegram,
  transfer: Icons.CWTransfer,
  trash: Icons.CWTrash,
  treasuryProposal: Icons.CWTreasuryProposal,
  twitter: Icons.CWTwitter,
  unsubscribe: Icons.CWUnsubscribe,
  upvote: Icons.CWUpvote,
  vote: Icons.CWVote,
  views: Icons.CWViews,
  wallet: Icons.CWWallet,
  website: Icons.CWWebsite,
  write: Icons.CWWrite,
};

export const customIconLookup = {
  'keplr-ethereum': CustomIcons.CWKeplr,
  'cosm-metamask': CustomIcons.CWMetaMask,
  keplr: CustomIcons.CWKeplr,
  magic: CustomIcons.CWMagic,
  metamask: CustomIcons.CWMetaMask,
  near: CustomIcons.CWNearWallet,
  phantom: CustomIcons.CWPhantom,
  polkadot: CustomIcons.CWPolkadot,
  ronin: CustomIcons.CWRonin,
  terrastation: CustomIcons.CWTerraStation2,
  unreads: CustomIcons.CWUnreads,
  walletconnect: CustomIcons.CWWalletConnect,
  'terra-walletconnect': CustomIcons.CWWalletConnect,
};

export type IconName = keyof typeof iconLookup;
export type CustomIconName = keyof typeof customIconLookup;
