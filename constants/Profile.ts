import {
  faChartSimple,
  faFileLines,
  faGears,
  faHeadset,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const PROFILE_ITEMS = [
  {
    id: "1",
    title: "My Preferences",
    icon: faChartSimple,
    route: "/preferences",
    active: true,
  },
  {
    id: "2",
    title: "Connected Socials",
    icon: faUsers,
    route: "/connected-socials",
    active: false,
  },
  {
    id: "3",
    title: "My Stats",
    active: false,
    icon: faChartSimple,
    route: "/my-stats",
  },
  {
    id: "4",
    title: "Reports",
    active: false,
    icon: faFileLines,
    route: "/reports",
  },
  {
    id: "5",
    title: "Help and Support",
    active: false,
    icon: faHeadset,
    route: "/help-and-support",
  },
];

export const PROFILE_BOTTOM_ITEMS = [
  {
    id: "4",
    title: "Settings",
    icon: faGears,
    route: "/settings",
  },
];
