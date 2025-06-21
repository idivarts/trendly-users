import { POPULAR_CITIES } from "@/shared-constants/locations";

export const SURVEY_DATA = [
  {
    id: 1,
    question: "What are your brand industry preference?",
    options: [
      "Fashion",
      "Beauty",
      "Restaurant / Cafes",
      "Holidays / Stays",
      "Beauty / Spa",
      "Others",
    ],
    multiselect: true,
  },
  {
    id: 2,
    question: "What is your content category?",
    options: [
      "Fun",
      "Lifestyle Vlogs",
      "Roast",
      "Meme",
      "Fashion / Beauty",
      "Tech",
      "Others",
    ],
    multiselect: true,
  },
  {
    id: 3,
    question: "Where are you located?",
    options: [...POPULAR_CITIES, "Others"],
    multiselect: false,
  },
];
