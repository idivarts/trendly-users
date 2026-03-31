import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

/**
 * Shared layout tokens for collaboration and contract detail surfaces.
 */
export function useCollaborationDetailSurfaceStyles() {
    const theme = useTheme();
    const c = Colors(theme);

    return useMemo(
        () =>
            StyleSheet.create({
                scrollContainer: {
                    gap: 16,
                    paddingBottom: 24,
                },
                profileCard: {
                    backgroundColor: c.card,
                    borderRadius: 10,
                    shadowColor: c.transparent,
                },
                profileContent: {
                    alignItems: "center",
                    width: "100%",
                    gap: 16,
                    paddingTop: 16,
                    paddingBottom: 24,
                },
                name: {
                    fontWeight: "bold",
                    fontSize: 20,
                    color: c.text,
                    paddingRight: 16,
                    flex: 1,
                    lineHeight: 20,
                },
                shortDescription: {
                    fontSize: 16,
                    color: c.text,
                    lineHeight: 22,
                    textAlign: "left",
                    marginTop: 16,
                },
                applyButton: {},
                descriptionWrap: {
                    width: "100%",
                    marginTop: 16,
                },
                columnFullWidth: {
                    width: "100%",
                },
                titleRow: {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    marginTop: 4,
                },
                titleColumn: {
                    flexDirection: "column",
                    width: "100%",
                },
                timestamp: {
                    fontSize: 12,
                    color: c.text,
                    paddingRight: 8,
                },
                borderedSection: {
                    width: "100%",
                    borderWidth: 0.3,
                    paddingVertical: 16,
                    borderRadius: 10,
                    borderColor: c.gray300,
                    backgroundColor: "transparent",
                },
                borderedSectionPad: {
                    width: "100%",
                    gap: 8,
                    borderWidth: 0.3,
                    borderRadius: 10,
                    borderColor: c.gray300,
                    padding: 16,
                },
                brandRow: {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flexGrow: 1,
                },
                brandTextColumn: {
                    flex: 1,
                    backgroundColor: "transparent",
                },
                brandTitle: {
                    fontSize: 16,
                    fontWeight: "bold",
                    color: c.text,
                },
                brandSubtitle: {
                    fontSize: 16,
                    flexWrap: "wrap",
                    overflow: "hidden",
                    lineHeight: 22,
                    color: c.text,
                },
                statLabel: {
                    fontSize: 16,
                    color: c.text,
                },
                sectionHeading: {
                    fontSize: 16,
                    color: c.text,
                    fontWeight: "bold",
                },
                sectionHeadingSpaced: {
                    fontSize: 16,
                    color: c.text,
                    fontWeight: "bold",
                    marginBottom: 16,
                },
                mutedCaption: {
                    fontSize: 12,
                    marginBottom: 8,
                    marginTop: 12,
                    color: c.gray100,
                },
                fullWidthButton: {
                    width: "100%",
                },
                invitationActions: {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 16,
                },
                externalLinksRow: {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 16,
                    justifyContent: "space-between",
                },
                externalLinkButton: {
                    flexBasis: 1,
                    flexGrow: 1,
                    backgroundColor: c.background,
                    borderColor: c.primary,
                    borderWidth: 0.3,
                },
                chipsWrap: {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    rowGap: 16,
                },
                locationBody: {
                    fontSize: 16,
                    color: c.text,
                    lineHeight: 24,
                },
                questionText: {
                    fontSize: 16,
                    color: c.text,
                },
                postedByBlock: {
                    width: "100%",
                    gap: 16,
                },
                managerRow: {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                },
                managerTextCol: {
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 2,
                },
                managerName: {
                    fontSize: 16,
                    fontWeight: "bold",
                    color: c.text,
                },
                managerRole: {
                    fontSize: 16,
                    color: c.gray100,
                },
                publicCollabActions: {
                    gap: 16,
                    width: "100%",
                },
                mediaWrap: {
                    alignSelf: "center",
                },
                brandCardCompact: {
                    width: "100%",
                    borderWidth: 0.3,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: c.gray300,
                },
                brandCardRow: {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flexGrow: 1,
                },
                brandImageContractCompact: {
                    width: 40,
                    height: 40,
                    borderRadius: 5,
                },
                flexOne: {
                    flex: 1,
                },
                pressableBrandArea: {
                    width: "100%",
                    flexDirection: "column",
                    gap: 16,
                },
            }),
        [c]
    );
}
