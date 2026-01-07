import { useColorScheme } from "@/components/theme/useColorScheme";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./auth-context.provider";

type ThemeType = "light" | "dark";

interface ThemeContextType {
    currentTheme: ThemeType;
    setCurrentTheme: (theme: ThemeType) => void;
    savedTheme: ThemeType;
    setSavedTheme: (theme: ThemeType) => void;
    hasChanges: boolean;
    revertChanges: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const systemColorScheme = useColorScheme();
    const { user } = useAuthContext();

    // Initialize with user's saved theme or system preference
    const initialTheme = (user?.settings?.theme ||
        systemColorScheme) as ThemeType;

    const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);
    const [savedTheme, setSavedTheme] = useState<ThemeType>(initialTheme);

    // Update when user changes (e.g., after login)
    useEffect(() => {
        const newTheme = (user?.settings?.theme || systemColorScheme) as ThemeType;
        setCurrentTheme(newTheme);
        setSavedTheme(newTheme);
    }, [user?.settings?.theme, user?.id]);

    const hasChanges = currentTheme !== savedTheme;

    const revertChanges = () => {
        setCurrentTheme(savedTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                currentTheme,
                setCurrentTheme,
                savedTheme,
                setSavedTheme,
                hasChanges,
                revertChanges,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within ThemeContextProvider");
    }
    return context;
};
