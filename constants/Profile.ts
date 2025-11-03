import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faCertificate,
  faChartSimple,
  faFile,
  faGears,
  faHeadset,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

export const PROFILE_ITEMS = [
  {
    id: "1",
    title: "My Preferences Jerry",
    icon: faChartSimple,
    route: "/preferences",
    active: true,
  },
  {
    id: "2",
    title: "My Contracts Jerry",
    icon: faFile,
    route: "/contracts",
    active: false,
  },
  {
    id: "4",
    title: "My Applications Jerry",
    icon: faDiscord,
    route: "/applications",
    active: false,
  },
  {
    id: "3",
    title: "Connected Socials Jerry",
    icon: faUsers,
    route: "/connected-socials",
    active: false,
  },
  {
    id: "6",
    title: "Verify Profile Jerry",
    active: false,
    icon: faCertificate,
    route: "/",
  },
  {
    id: "7",
    title: "Help and Support Jerry",
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
