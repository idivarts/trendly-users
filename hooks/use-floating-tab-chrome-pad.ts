import useBreakpoints from "@/hooks/use-breakpoints";
import {
    floatingGlassHeaderContentPad,
    glassTabBarBottomReserve,
} from "@/shared-uis/components/glass/glassChromeConstants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Options = {
    /**
     * True when the screen root is `AppLayout` / SafeAreaView that already applies top inset
     * (typical tab roots). False for raw full-screen roots (e.g. messages list).
     */
    parentHandlesSafeAreaTop?: boolean;
};

/**
 * Insets so scrollable tab content clears the transparent floating header and bottom tab pill.
 */
export function useFloatingTabChromePad(options: Options = {}) {
    const { parentHandlesSafeAreaTop = true } = options;
    const { xl } = useBreakpoints();
    const insets = useSafeAreaInsets();

    if (xl) {
        return { top: 0, bottom: 0 };
    }

    const belowHeader = floatingGlassHeaderContentPad();
    const top = parentHandlesSafeAreaTop
        ? belowHeader
        : insets.top + belowHeader;
    const bottom = glassTabBarBottomReserve(insets.bottom);

    return { top, bottom };
}
