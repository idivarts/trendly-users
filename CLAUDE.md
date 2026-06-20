# CLAUDE.md — trendly-users

**Read this before touching any code in this project.**
This file was migrated from `.cursor/rules/` and is the authoritative context for all AI-assisted work in this repo.

For the monorepo overview (stack, API routes, domain model, etc.) see the root `../CLAUDE.md`.
Reference plans for complex features: `.claude/plans/`

---

## Project Overview

**trendly-users** is the React Native (Expo) app for **influencers/creators** on the Trendly platform.
It is a cross-platform app (iOS + Android + Web via expo-router).

- **Bundle ID**: `@idiv__trendly-creators`
- **Stack**: React Native 0.81 + Expo SDK 54 + Expo Router 6 + TypeScript
- **Notable libs**: Stream Chat (`stream-chat-expo`), Firebase (auth + push), Canvas Charts, Tiptap (rich text)

---

## UI Styling Rules — ALWAYS APPLY

These rules apply to every UI component touched or created in this project. Check against these before finishing any UI work.

### Color and Theme
- **Never** use hardcoded colors (`#hex`, `rgb()`, named CSS colors) in components.
- **Always** derive the palette: `const theme = useTheme(); const colors = Colors(theme);`
- Reuse existing color keys from `shared-uis/constants/Colors.ts` before adding any new key.
- Add new keys only when truly required — keep them aligned with the platform's professional visual tone.
- Every new or updated UI **must** look correct in both **light and dark** themes.

### Responsive Layout
- **Do not** use `Dimensions.get("window")` directly inside components for responsive layout.
- For module-level utility code (where hooks can't be used), use `getConstrainedWidth()` / `getConstrainedHeight()` from `shared-libs/contexts/mobile-layout-context.provider.tsx`.

### Stylesheet Structure
- Keep `StyleSheet.create(...)` at the **bottom** of the file — never at the top or mid-file.
- Keep styles **colocated** in the same file as the component — no external stylesheet files.
- **No inline style objects** in JSX (no `style={{ marginTop: 8 }}`). Put them in `StyleSheet`.

### Quick Pattern (copy this)
```tsx
const theme = useTheme();
const colors = Colors(theme);
const styles = useMemo(() => useStyles(colors), [colors]);
```

> Note: `trendly-users` does not use `useBreakpoints()` — this is brands-only. Keep layout mobile-first.

### Self-Check Before Finishing UI Work
- [ ] Colors come from `Colors(theme)` tokens — zero hardcoded hex/rgb values
- [ ] Existing color tokens were preferred over adding new ones
- [ ] UI is correct in both light and dark themes
- [ ] No `Dimensions.get("window")` for responsive layout
- [ ] `StyleSheet.create(...)` is at the bottom of the file
- [ ] No inline style objects in JSX
- [ ] No external stylesheet imports

---

## Project Structure

```
trendly-users/
├── app/                    # Expo Router file-based routes
│   ├── (auth)/             # pre-signin, login, signup, forgot-password, beta
│   ├── (main)/
│   │   ├── (onboarding)/   # Social connect flow (IG, manual IG, questions survey)
│   │   ├── (inside)/
│   │   │   ├── (tabs)/     # Bottom tabs: collaborations, invites, messages, influencers, profile
│   │   │   └── (screens)/  # Stack screens: collab-details, apply-now, contract-details, activity, profile
│   │   ├── verification/   # KYC flow: bank, address, agreement
│   │   └── channel/        # Chat conversation
│   └── (public)/           # Public: collaboration share link, insta-redirect
├── components/             # Shared UI components
├── constants/              # Theme, Collabs, Contracts, SurveyData, Notification, etc.
├── contexts/               # React contexts (auth, collaboration, contract, chat, social, KYC, etc.)
├── types/                  # TypeScript types (User, Collaboration, Contract, Profile, etc.)
├── utils/                  # url.ts, token.ts, profile.ts, date.ts, conversion.ts
├── hooks/                  # use-edit-profile, use-breakpoints (web only), use-process
├── styles/                 # Shared style files
├── shared-constants/       # Git submodule: contract-status.ts, app.ts, route-agreement.ts
├── shared-libs/            # Git submodule: shared business logic
└── shared-uis/             # Git submodule: shared UI components
```

---

## Key Contexts

| Context | File | Purpose |
|---|---|---|
| Auth | `contexts/auth-context.provider.tsx` | Firebase user + JWT token |
| Collaboration | `contexts/collaboration-context.provider.tsx` | Collab list + filters |
| Contract | `contexts/contract-context.provider.tsx` | Active contracts |
| Brand | `contexts/brand-context.provider.tsx` | Brand data (viewed by influencer) |
| Chat | `contexts/chat-context.provider.tsx` | Stream Chat client |
| Social | `contexts/social-context.provider.tsx` | Connected IG/FB accounts |
| Group | `contexts/group-context.provider.tsx` | Influencer groups |
| KYC | `contexts/kyc-flow-context.provider.tsx` | KYC step state |
| Notification | `contexts/notification-context.provider.tsx` | Push notifications |

---

## Contract Flow (Influencer Side)

The contract lifecycle has **11 states (0–10)**. As the influencer, the app is the **active actor** on states 5 (upload deliverable), 9 (feedback). All other states are passive waits with messaging affordance.

Full state-by-state breakdown and implementation guide:
`.claude/plans/users-contract-flow-parity.md`

Contract status enum source of truth: `shared-constants/contract-status.ts`

The `ActionContainer` pattern (per-state button/message config, no inline API calls, API calls in `components/contracts/api/State_<n>_api.ts`) mirrors the brands app — see the plan doc for parity details.

---

## Shared Submodules (Read Before Editing)

These are **git submodules** shared with `trendly-brands`. Changes here affect both apps.

| Path | Contents |
|---|---|
| `shared-constants/contract-status.ts` | ContractStatus enum — source of truth for all states |
| `shared-constants/app.ts` | Global app config (API base URL, etc.) |
| `shared-constants/route-agreement.ts` | KYC route agreement text |
| `shared-libs/` | Shared business logic, firestore models |
| `shared-uis/` | Shared UI components (including `Colors.ts`, `ContractActionsWithMessage`) |

---

## Build Commands

```bash
npm run ios           # Local iOS simulator
npm run android       # Local Android emulator
npm run web           # Web dev server
npm run build-ios     # EAS production iOS build → build/Trendly.ipa
npm run build-android # EAS production Android build → build/Trendly.aab
npm run submit-ios    # Submit to App Store
npm run submit-android-prod # Submit to Play Store
npm run populate      # Run data population script (ts-node scripts/populate.ts)
```
