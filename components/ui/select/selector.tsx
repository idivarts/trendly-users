import Colors from '@/shared-uis/constants/Colors';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme, useTheme } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface OptionType {
  icon: IconProp;
  label: string;
  value: string;
}

interface SelectorProps {
  onSelect: (value: string) => void;
  options: OptionType[];
  selectedValue?: string;
}

export const Selector: React.FC<SelectorProps> = ({
  onSelect,
  options,
  selectedValue,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          style={[
            styles.option,
            selectedValue === option.value && styles.selectedOption,
          ]}
          onPress={() => onSelect(option.value)}
        >
          <FontAwesomeIcon
            icon={option.icon}
            size={24}
            color={Colors(theme).primary}
          />
          <Text style={styles.optionText}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  option: {
    flex: 1,
    backgroundColor: Colors(theme).background,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors(theme).lightgray,
    gap: 8,
  },
  selectedOption: {
    backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).aliceBlue,
    borderColor: Colors(theme).primary,
  },
  optionText: {
    fontSize: 14,
    color: theme.dark ? Colors(theme).white : Colors(theme).gray300,
    marginTop: 4,
  },
});
