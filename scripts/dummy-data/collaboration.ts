enum PromotionType {
    STORY_PROMOTION = "STORY_PROMOTION",
    FEED_PROMOTION = "FEED_PROMOTION",
    LIVE_PROMOTION = "LIVE_PROMOTION",
    USER_GENERATED_CONTENT = "USER_GENERATED_CONTENT",
    ADD_REVIEWS = "ADD_REVIEWS",
}
enum CollaborationType {
    PAID = "PAID",
    UNPAID = "UNPAID",
}
enum SocialPlatform {
    FACEBOOK = "FACEBOOK",
    INSTAGRAM = "INSTAGRAM",
    YOUTUBE = "YOUTUBE",
    TWITTER = "TWITTER",
    OTHERS = "OTHERS",
}

export const collaborationsData = [
    {
        name: "Fashion Campaign This is",
        description: "Collaboration for promoting new fashion products",
        timeStamp: Date.now(),
        budget: { min: 1000, max: 5000 },
        location: {
            type: "physical",
            name: "Paris",
            latlong: { lat: 48.8566, lng: 2.3522 },
        },
        promotionType: PromotionType.FEED_PROMOTION,
        collaborationType: CollaborationType.PAID,
        platform: SocialPlatform.INSTAGRAM,
        numberOfInfluencersNeeded: 3,
        externalLinks: ["https://example.com/fashion"],
        viewsLastHour: 100,
        lastReviewedTimeStamp: null,
    },
];
