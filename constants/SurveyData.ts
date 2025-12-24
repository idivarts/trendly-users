import { INITIAL_BRAND_INDUSTRIES } from "@/shared-constants/ItemsList";
import { CONTENT_NICHE } from "@/shared-constants/preferences/content-niche";
import { POPULAR_CITIES } from "@/shared-constants/preferences/locations";

export const SURVEY_DATA = [
    {
        id: 1,
        question: "What are your brand industry preference?",
        options: INITIAL_BRAND_INDUSTRIES,
        multiselect: true,
    },
    {
        id: 2,
        question: "What is your content category?",
        options: CONTENT_NICHE,
        multiselect: true,
    },
    {
        id: 3,
        question: "Where are you located?",
        options: [...POPULAR_CITIES, "Others"],
        multiselect: false,
    },
];
