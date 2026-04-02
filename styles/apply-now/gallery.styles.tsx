import { getConstrainedWidth } from "@/contexts";
import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const width = getConstrainedWidth();
const SPACING = 8;
const COLUMNS = 3;
const ITEM_WIDTH = (width - SPACING * (COLUMNS + 1)) / COLUMNS;

export const stylesFn = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors(theme).background,
        },
        timerContainer: {
            position: "absolute",
            alignSelf: "center",
            top: 0,
            padding: 10,
            borderRadius: 5,
            marginTop: 50,
        },
        timerText: {
            color: Colors(theme).white,
            fontSize: 24,
            fontWeight: "bold",
        },
        actionButtons: {
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 16,
        },
        galleryContainer: {
            padding: SPACING,
        },
        itemWrapper: {
            width: ITEM_WIDTH,
            height: ITEM_WIDTH,
            margin: SPACING / 2,
        },
        itemContainer: {
            flex: 1,
            borderRadius: 8,
        },
        image: {
            width: "100%",
            height: "100%",
            borderRadius: 8,
        },
        checkboxContainer: {
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: Colors(theme).white,
            borderTopLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        footer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 16,
        },
        permissionContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
        },
        camera: {
            flex: 1,
        },
        cameraButtons: {
            position: "absolute",
            bottom: 30,
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-around",
            paddingHorizontal: 16,
        },
    });
