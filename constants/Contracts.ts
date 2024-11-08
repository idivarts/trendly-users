interface ProposalCard {
  collaborationName: string;
  brandName: string;
  cost: string;
  status: {
    sent: boolean;
    active: boolean;
    approvalPending: boolean;
    changesRequested: boolean;
    done: boolean;
    prematureEnd: boolean;
    archived: boolean;
  };
}

export const DummyProposalData: ProposalCard[] = [
  {
    collaborationName: "Collaboration Name",
    brandName: "Brand Name",
    cost: "Cost",
    status: {
      sent: true,
      active: false,
      approvalPending: false,
      changesRequested: false,
      done: false,
      prematureEnd: false,
      archived: false,
    },
  },
  {
    collaborationName: "Collaboration Name",
    brandName: "Brand Name",
    cost: "Cost",
    status: {
      sent: true,
      active: false,
      approvalPending: false,
      changesRequested: false,
      done: false,
      prematureEnd: false,
      archived: false,
    },
  },
  {
    collaborationName: "Collaboration Name",
    brandName: "Brand Name",
    cost: "Cost",
    status: {
      sent: true,
      active: false,
      approvalPending: false,
      changesRequested: false,
      done: false,
      prematureEnd: false,
      archived: false,
    },
  },
  {
    collaborationName: "Collaboration Name",
    brandName: "Brand Name",
    cost: "Cost",
    status: {
      sent: true,
      active: false,
      approvalPending: false,
      changesRequested: false,
      done: false,
      prematureEnd: false,
      archived: false,
    },
  },
];
