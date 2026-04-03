import type { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { PersistentStorage } from "@/shared-libs/utils/persistent-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

const KYC_DRAFT_STORAGE_KEY = "KYC_FLOW_DRAFT_V2";
const KYC_DRAFT_STORAGE_KEY_LEGACY = "KYC_FLOW_DRAFT_V1";

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

export const KYCFlowProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [draft, setDraft] = useState<KYCFlowDraft>(DEFAULT_DRAFT);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const hydrate = async () => {
            try {
                const stored =
                    (await PersistentStorage.get(KYC_DRAFT_STORAGE_KEY)) ||
                    (await PersistentStorage.get(KYC_DRAFT_STORAGE_KEY_LEGACY));
                if (stored) {
                    const parsed = JSON.parse(stored) as Partial<KYCFlowDraft> & {
                        panDetails?: Partial<KYCPanDraft> & { name?: string; pan?: string };
                        currentAddress?: Partial<KYCAddressDraft> & {
                            postal_code?: string;
                        };
                        bankDetails?: Partial<KYCBankDraft> & {
                            account_number?: string;
                            beneficiary_name?: string;
                        };
                    };
                    const pan = parsed.panDetails || {};
                    const addr = parsed.currentAddress || {};
                    const bank = parsed.bankDetails || {};
                    setDraft({
                        panDetails: {
                            ...DEFAULT_DRAFT.panDetails,
                            nameAsPerPAN:
                                pan.nameAsPerPAN ??
                                ("name" in pan ? pan.name : "") ??
                                "",
                            panNumber:
                                pan.panNumber ??
                                ("pan" in pan ? pan.pan : "") ??
                                "",
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
                                ("account_number" in bank
                                    ? bank.account_number
                                    : "") ??
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
                }
            } catch (error) {
                console.error("Failed to hydrate KYC draft", error);
            } finally {
                setHydrated(true);
            }
        };
        hydrate();
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        PersistentStorage.set(KYC_DRAFT_STORAGE_KEY, JSON.stringify(draft)).catch(
            (error) => {
                console.error("Failed to persist KYC draft", error);
            }
        );
    }, [draft, hydrated]);

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
        await PersistentStorage.clear(KYC_DRAFT_STORAGE_KEY);
    }, []);

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
