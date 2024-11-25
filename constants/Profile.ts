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
    title: "Connected Socials",
    icon: faUsers,
    route: "/connected-socials",
  },
  {
    id: "2",
    title: "My Stats",
    icon: faChartSimple,
    route: "/my-stats",
  },
  {
    id: "3",
    title: "Reports",
    icon: faFileLines,
    route: "/reports",
  },
];

export const PROFILE_BOTTOM_ITEMS = [
  {
    id: "4",
    title: "Settings",
    icon: faGears,
    route: "/settings",
  },
  {
    id: "5",
    title: "Help and Support",
    icon: faHeadset,
    route: "/help-and-support",
  },
];
