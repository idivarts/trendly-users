import { PersistentStorage } from "@/shared-libs/utils/persistent-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

const KYC_DRAFT_STORAGE_KEY = "KYC_FLOW_DRAFT_V1";

export interface KYCPanDraft {
    name: string;
    pan: string;
}

export interface KYCAddressDraft {
    street: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
}

export interface KYCBankDraft {
    account_number: string;
    ifsc: string;
    beneficiary_name: string;
}

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
        name: "",
        pan: "",
    },
    currentAddress: {
        street: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
    },
    bankDetails: {
        account_number: "",
        ifsc: "",
        beneficiary_name: "",
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
                const stored = await PersistentStorage.get(KYC_DRAFT_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as Partial<KYCFlowDraft>;
                    setDraft({
                        panDetails: {
                            ...DEFAULT_DRAFT.panDetails,
                            ...(parsed.panDetails || {}),
                        },
                        currentAddress: {
                            ...DEFAULT_DRAFT.currentAddress,
                            ...(parsed.currentAddress || {}),
                        },
                        bankDetails: {
                            ...DEFAULT_DRAFT.bankDetails,
                            ...(parsed.bankDetails || {}),
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
