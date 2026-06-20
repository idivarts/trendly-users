import type { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { PersistentStorage } from "@/shared-libs/utils/persistent-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

/** Legacy global keys (not user-scoped); cleared on logout and after submit to prevent cross-account leakage. */
const KYC_DRAFT_STORAGE_KEY = "KYC_FLOW_DRAFT_V2";
const KYC_DRAFT_STORAGE_KEY_LEGACY = "KYC_FLOW_DRAFT_V1";

const LEGACY_KYC_DRAFT_KEYS = [KYC_DRAFT_STORAGE_KEY_LEGACY, KYC_DRAFT_STORAGE_KEY] as const;

export function kycDraftStorageKeyForUser(userId: string) {
    return `KYC_FLOW_DRAFT_V3_${userId}`;
}

export async function clearAllKycDraftPersistence(userId: string | undefined | null) {
    await Promise.all([
        ...LEGACY_KYC_DRAFT_KEYS.map((key) => PersistentStorage.clear(key)),
        ...(userId ? [PersistentStorage.clear(kycDraftStorageKeyForUser(userId))] : []),
    ]);
}

/** Matches `IUsers.kyc.panDetails` field names; used as multi-step form draft before submit. */
export type KYCPanDraft = NonNullable<NonNullable<IUsers["kyc"]>["panDetails"]>;

/** Matches `IUsers.kyc.currentAddress` plus optional `line2` merged into `street` on submit. */
export interface KYCAddressDraft
    extends NonNullable<NonNullable<IUsers["kyc"]>["currentAddress"]> {
    line2?: string;
}

export type KYCBankDraft = NonNullable<NonNullable<IUsers["kyc"]>["bankDetails"]>;

export interface KYCAgreementDraft {
    panConsent: boolean;
    termsConsent: boolean;
}

export interface KYCFlowDraft {
    panDetails: KYCPanDraft;
    currentAddress: KYCAddressDraft;
    bankDetails: KYCBankDraft;
    agreements: KYCAgreementDraft;
}

/** Parsed local-storage shape: `IUsers.kyc` field names plus legacy snake_case keys. */
type KYCStoredDraftPan = Partial<KYCPanDraft> & { name?: string; pan?: string };
type KYCStoredDraftAddress = Partial<KYCAddressDraft> & { postal_code?: string };
type KYCStoredDraftBank = Partial<KYCBankDraft> & {
    account_number?: string;
    beneficiary_name?: string;
};

const DEFAULT_DRAFT: KYCFlowDraft = {
    panDetails: {
        nameAsPerPAN: "",
        panNumber: "",
    },
    currentAddress: {
        street: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
    },
    bankDetails: {
        accountNumber: "",
        ifsc: "",
        beneficiaryName: "",
    },
    agreements: {
        panConsent: false,
        termsConsent: false,
    },
};

interface KYCFlowContextValue {
    draft: KYCFlowDraft;
    hydrated: boolean;
    setPan: (pan: Partial<KYCPanDraft>) => void;
    setAddress: (address: Partial<KYCAddressDraft>) => void;
    setBank: (bank: Partial<KYCBankDraft>) => void;
    setAgreements: (agreements: Partial<KYCAgreementDraft>) => void;
    reset: () => Promise<void>;
}

const KYCFlowContext = createContext<KYCFlowContextValue>({
    draft: DEFAULT_DRAFT,
    hydrated: false,
    setPan: () => undefined,
    setAddress: () => undefined,
    setBank: () => undefined,
    setAgreements: () => undefined,
    reset: async () => undefined,
});

export const useKYCFlowContext = () => useContext(KYCFlowContext);

type KYCFlowProviderProps = PropsWithChildren<{
    /** Firestore user id; draft is stored and loaded only for this user. */
    userId?: string | null;
}>;

export const KYCFlowProvider: React.FC<KYCFlowProviderProps> = ({
    children,
    userId,
}) => {
    const [draft, setDraft] = useState<KYCFlowDraft>(DEFAULT_DRAFT);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        if (!userId) {
            setDraft(DEFAULT_DRAFT);
            setHydrated(true);
            return;
        }

        setHydrated(false);
        setDraft(DEFAULT_DRAFT);

        let cancelled = false;
        const hydrate = async () => {
            try {
                const storageKey = kycDraftStorageKeyForUser(userId);
                const stored = await PersistentStorage.get(storageKey);
                if (!stored || cancelled) return;

                const parsed = JSON.parse(stored) as Partial<KYCFlowDraft> & {
                    panDetails?: KYCStoredDraftPan;
                    currentAddress?: KYCStoredDraftAddress;
                    bankDetails?: KYCStoredDraftBank;
                };
                const pan: KYCStoredDraftPan = parsed.panDetails ?? {};
                const addr: KYCStoredDraftAddress = parsed.currentAddress ?? {};
                const bank: KYCStoredDraftBank = parsed.bankDetails ?? {};
                if (cancelled) return;
                setDraft({
                    panDetails: {
                        ...DEFAULT_DRAFT.panDetails,
                        nameAsPerPAN:
                            pan.nameAsPerPAN ??
                            ("name" in pan ? pan.name : "") ??
                            "",
                        panNumber:
                            pan.panNumber ?? ("pan" in pan ? pan.pan : "") ?? "",
                    },
                    currentAddress: {
                        ...DEFAULT_DRAFT.currentAddress,
                        street: addr.street ?? "",
                        line2: addr.line2 ?? "",
                        city: addr.city ?? "",
                        state: addr.state ?? "",
                        postalCode:
                            addr.postalCode ??
                            ("postal_code" in addr ? addr.postal_code : "") ??
                            "",
                    },
                    bankDetails: {
                        ...DEFAULT_DRAFT.bankDetails,
                        accountNumber:
                            bank.accountNumber ??
                            ("account_number" in bank ? bank.account_number : "") ??
                            "",
                        ifsc: bank.ifsc ?? "",
                        beneficiaryName:
                            bank.beneficiaryName ??
                            ("beneficiary_name" in bank
                                ? bank.beneficiary_name
                                : "") ??
                            "",
                    },
                    agreements: {
                        ...DEFAULT_DRAFT.agreements,
                        ...(parsed.agreements || {}),
                    },
                });
            } catch (error) {
                console.error("Failed to hydrate KYC draft", error);
            } finally {
                if (!cancelled) {
                    setHydrated(true);
                }
            }
        };
        hydrate();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    useEffect(() => {
        if (!hydrated || !userId) return;
        const storageKey = kycDraftStorageKeyForUser(userId);
        PersistentStorage.set(storageKey, JSON.stringify(draft)).catch((error) => {
            console.error("Failed to persist KYC draft", error);
        });
    }, [draft, hydrated, userId]);

    const setPan = useCallback((pan: Partial<KYCPanDraft>) => {
        setDraft((prev) => ({
            ...prev,
            panDetails: {
                ...prev.panDetails,
                ...pan,
            },
        }));
    }, []);

    const setAddress = useCallback((address: Partial<KYCAddressDraft>) => {
        setDraft((prev) => ({
            ...prev,
            currentAddress: {
                ...prev.currentAddress,
                ...address,
            },
        }));
    }, []);

    const setBank = useCallback((bank: Partial<KYCBankDraft>) => {
        setDraft((prev) => ({
            ...prev,
            bankDetails: {
                ...prev.bankDetails,
                ...bank,
            },
        }));
    }, []);

    const setAgreements = useCallback(
        (agreements: Partial<KYCAgreementDraft>) => {
            setDraft((prev) => ({
                ...prev,
                agreements: {
                    ...prev.agreements,
                    ...agreements,
                },
            }));
        },
        []
    );

    const reset = useCallback(async () => {
        setDraft(DEFAULT_DRAFT);
        await clearAllKycDraftPersistence(userId ?? undefined);
    }, [userId]);

    const value = useMemo(
        () => ({
            draft,
            hydrated,
            setPan,
            setAddress,
            setBank,
            setAgreements,
            reset,
        }),
        [draft, hydrated, setPan, setAddress, setBank, setAgreements, reset]
    );

    return (
        <KYCFlowContext.Provider value={value}>
            {children}
        </KYCFlowContext.Provider>
    );
};
