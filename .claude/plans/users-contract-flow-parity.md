# Plan: Contract Flow Implementation (users app)

**Status**: Reference implementation spec — use this when building or modifying the contract flow in trendly-users.

**Migrated from**: `.cursor/rules/plans/users_contract_flow_parity_36bfdaff.plan.md`

**Authoritative copy** (with brands-side source-of-truth references): `../trendly-brands/.claude/plans/users-contract-flow-parity.md`

---

## Goal

Implement the contract-with-payment flow for the **influencer side** with exact state behavior parity to the brands app, shared module usage, and consistent UI/action architecture.

---

## Source of Truth — Reuse First

Do NOT duplicate — import from shared modules:

| What | Where |
|---|---|
| Contract status enum | `shared-constants/contract-status.ts` |
| Firestore contract model | `shared-libs/firestore/trendly-pro/models/contracts.ts` |
| Shared UI shell | `shared-uis/components/contract-actions-with-message/ContractActionsWithMessage.tsx` |

Mirror these patterns from the **brands app**:
- `components/contracts/ActionContainer.tsx` — single state router architecture
- `components/contracts/api/State_<n>_api.ts` — per-state API file pattern

---

## Required Code Structure (This App)

```
components/contracts/
├── ActionContainer.tsx          # Single state router — mirrors brands architecture
├── api/
│   ├── State_5_api.ts           # Upload deliverable (influencer primary action)
│   ├── State_6_api.ts           # Re-upload on revision request
│   └── State_9_api.ts           # Feedback submission
└── (modals / bottom sheets for user-owned actions)
```

---

## Influencer's Role Per State

| State | # | Influencer Role | Required UI |
|---|---|---|---|
| Pending | 0 | Passive | Wait-for-brand message + chat CTA. No state mutation. |
| Started | 1 | Passive | Informational + messaging affordance |
| ShipmentPending | 3 | Await shipment | Show address readiness + expectation messaging |
| DeliveryPending | 4 | Await confirmation | Delivery-in-progress status; block upload actions |
| **VideoPending** | **5** | **Upload deliverable video** | Primary upload action with validation + refresh |
| ReviewPending | 6 | Wait; re-upload if revision requested | Review lock state; revision note; re-upload path |
| PlanRelease | 7 | Passive awareness | Read-only schedule display |
| PostScheduled | 8 | Wait for go-live | Scheduled date + countdown/expectation UX |
| **PostDone** | **9** | **Submit feedback** | Feedback CTA + closure messaging |
| Settled | 10 | Closed | Read-only contract summary |

---

## Architecture Rules

- **No inline API calls** in UI components. All calls go in `components/contracts/api/State_<n>_api.ts`.
- Each API file: payload type(s) + request call + normalized error (`HttpWrapper.extractErrorMessage`)
- ActionContainer: one `useMemo` block for buttons + message config; `handle<State>Action` handlers separated from render; modal orchestration colocated
- All state transitions: call `refreshData()` after success, reconcile local UI state

---

## Implementation Sequence

1. Create `components/contracts/ActionContainer.tsx` with brands-parity skeleton (state decision tree)
2. Create `components/contracts/api/State_5_api.ts`, `State_6_api.ts`, `State_9_api.ts`
3. Create/port modals and bottom sheets for upload (State 5), re-upload (State 6), feedback (State 9)
4. Wire handlers → API wrappers → toasts → `refreshData`
5. Validate all states 0→10 end-to-end with test contracts
6. Lint + type check + manual QA on both native and web

---

## Validation Checklist

- [ ] Every state has explicit influencer-side UI (no fallthrough)
- [ ] All transitions have `State_<n>_api.ts` wrappers
- [ ] `refreshData` fires after every successful action
- [ ] Invalid actions blocked by ActionContainer state guardrails
- [ ] Only shared-module imports used — no local enum duplicates
- [ ] Regression: all states work correctly on both web and native
- [ ] UI styling follows users-app rules: `Colors(theme)`, StyleSheet at bottom, no inline styles
