import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/styles/FilterModal.styles";
import { faCheckDouble, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useRef, useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { Chip } from "react-native-paper";
import { Text, View } from "./theme/Themed";
import Button from "./ui/button";

interface CollaborationFilterProps {
    onClose: () => void;
    setSelectedCategory: (category: string) => void;
    setSelectedJobType: (jobType: string) => void;
    setSalaryRange: (salaryRange: number[]) => void;
    currentCategory: string;
    currentJobType: string;
    currentSalaryRange: number[];
    categories: any[];
    jobTypes: any[];
    isVisible: boolean; // Added to control the visibility of the Bottom Sheet
}

const CollaborationFilter = ({
    onClose,
    setSelectedCategory,
    setSelectedJobType,
    setSalaryRange,
    currentCategory,
    currentJobType,
    currentSalaryRange,
    categories,
    jobTypes,
    isVisible, // Handle visibility from the parent component
}: CollaborationFilterProps) => {
    const [localSelectedCategory, setLocalSelectedCategory] = useState(
        currentCategory || "All"
    );
    const [localSelectedJobType, setLocalSelectedJobType] = useState(
        currentJobType || "All"
    );
    const [localSalaryRange, setLocalSalaryRange] = useState<number[]>(
        currentSalaryRange || [0, 5000]
    );

    const sheetRef = useRef<BottomSheet>(null);

    const applyFilters = () => {
        setSelectedCategory(localSelectedCategory);
        setSelectedJobType(localSelectedJobType);
        setSalaryRange(localSalaryRange);
        onClose();
        if (sheetRef.current) {
            sheetRef.current.close(); // Close the sheet after applying
        }
    };

    const theme = useTheme();
    const styles = stylesFn(theme);

    const snapPoints = useMemo(() => ["25%", "50%", "75%", "100%"], []);

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <BottomSheet
                ref={sheetRef}
                index={isVisible ? 1 : -1} // Controls visibility of BottomSheet
                snapPoints={snapPoints}
                enablePanDownToClose
                backdropComponent={(backdropProps) => (
                    <BottomSheetBackdrop
                        {...backdropProps}
                        disappearsOnIndex={-1}
                        appearsOnIndex={1}
                        pressBehavior="close"
                        style={styles.backdrop}
                    />
                )}
                onClose={onClose}
                handleStyle={{
                    backgroundColor: Colors(theme).background,
                }}
                handleIndicatorStyle={{
                    backgroundColor: Colors(theme).text,
                }}
            >
                <BottomSheetView style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filter</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesomeIcon
                                icon={faClose}
                                size={24}
                                color={Colors(theme).text}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Categories Section */}
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.chipContainer}>
                        {categories.map((category) => (
                            <Chip
                                icon={
                                    localSelectedCategory === category
                                        ? () => (
                                            <FontAwesomeIcon
                                                icon={faCheckDouble}
                                                size={16}
                                                color={Colors(theme).white}
                                            />
                                        )
                                        : undefined
                                }
                                key={category}
                                selected={localSelectedCategory === category}
                                onPress={() => setLocalSelectedCategory(category)}
                                style={styles.chip}
                            >
                                {category}
                            </Chip>
                        ))}
                    </View>

                    {/* Salaries Section */}
                    <Text style={styles.sectionTitle}>Salaries</Text>
                    <View style={styles.salaryContainer}>
                        <Text style={styles.salaryLabel}>
                            Min Salary: Rs. {localSalaryRange[0].toLocaleString() || "0"}
                        </Text>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={localSalaryRange[1]}
                            step={1000}
                            value={localSalaryRange[0]}
                            onValueChange={(value) =>
                                setLocalSalaryRange([value, localSalaryRange[1]])
                            }
                        />
                    </View>
                    <View style={styles.salaryContainer}>
                        <Text style={styles.salaryLabel}>
                            Max Salary: Rs. {localSalaryRange[1].toLocaleString() || "0"}
                        </Text>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={localSalaryRange[0]}
                            maximumValue={5000}
                            step={1000}
                            value={localSalaryRange[1]}
                            onValueChange={(value) =>
                                setLocalSalaryRange([localSalaryRange[0], value])
                            }
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Job Types</Text>
                    <View style={styles.chipContainer}>
                        {jobTypes.map((jobType) => (
                            <Chip
                                key={jobType}
                                selected={localSelectedJobType === jobType}
                                onPress={() => setLocalSelectedJobType(jobType)}
                                style={styles.chip}
                                icon={
                                    localSelectedJobType === jobType
                                        ? () => (
                                            <FontAwesomeIcon
                                                icon={faCheckDouble}
                                                size={16}
                                                color={Colors(theme).white}
                                            />
                                        )
                                        : undefined
                                }
                            >
                                {jobType}
                            </Chip>
                        ))}
                    </View>

                    <Button
                        mode="contained"
                        onPress={applyFilters}
                        style={styles.applyButton}
                    >
                        Apply Filters
                    </Button>
                </BottomSheetView>
            </BottomSheet>
        </Modal>
    );
};

export default CollaborationFilter;
