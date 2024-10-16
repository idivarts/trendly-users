interface ProposalCard {
  name: string;
  brandName: string;
  brandId: string;
  budget: {
    min: number;
    max: number;
  };
  cardType: string;
  collaborationType: string;
  id: string;
  location: {
    latlong: {
      latitude: number;
      longitude: number;
    };
    name: string;
    type: string;
  };
  managerId: string;
  numberOfInfluencersNeeded: number;
  platform: string;
  promotionType: string;
  timeStamp: number;
}

export const DummyProposalData: ProposalCard[] = [
  {
    name: "Proposal",
    brandName: "Brand Name",
    brandId: "brandId",
    budget: {
      min: 100,
      max: 1000,
    },
    cardType: "proposal",
    collaborationType: "PAID",
    id: "1",
    location: {
      latlong: {
        latitude: 0,
        longitude: 0,
      },
      name: "Location",
      type: "physical",
    },
    managerId: "managerId",
    numberOfInfluencersNeeded: 1,
    platform: "INSTAGRAM",
    promotionType: "ADD_REVIEWS",
    timeStamp: new Date().getTime(),
  },
  {
    name: "Proposal",
    brandName: "Brand Name",
    brandId: "brandId",
    budget: {
      min: 100,
      max: 1000,
    },
    cardType: "proposal",
    collaborationType: "PAID",
    id: "2",
    location: {
      latlong: {
        latitude: 0,
        longitude: 0,
      },
      name: "Location",
      type: "physical",
    },
    managerId: "managerId",
    numberOfInfluencersNeeded: 1,
    platform: "INSTAGRAM",
    promotionType: "ADD_REVIEWS",
    timeStamp: new Date().getTime(),
  },
  {
    name: "Proposal",
    brandName: "Brand Name",
    brandId: "brandId",
    budget: {
      min: 100,
      max: 1000,
    },
    cardType: "proposal",
    collaborationType: "PAID",
    id: "3",
    location: {
      latlong: {
        latitude: 0,
        longitude: 0,
      },
      name: "Location",
      type: "physical",
    },
    managerId: "managerId",
    numberOfInfluencersNeeded: 1,
    platform: "INSTAGRAM",
    promotionType: "ADD_REVIEWS",
    timeStamp: new Date().getTime(),
  },
  {
    name: "Proposal",
    brandName: "Brand Name",
    brandId: "brandId",
    budget: {
      min: 100,
      max: 1000,
    },
    cardType: "proposal",
    collaborationType: "PAID",
    id: "4",
    location: {
      latlong: {
        latitude: 0,
        longitude: 0,
      },
      name: "Location",
      type: "physical",
    },
    managerId: "managerId",
    numberOfInfluencersNeeded: 1,
    platform: "INSTAGRAM",
    promotionType: "ADD_REVIEWS",
    timeStamp: new Date().getTime(),
  },
];
