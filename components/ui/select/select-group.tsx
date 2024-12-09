import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SelectItem } from '.';
import { useTheme } from '@react-navigation/native';
import stylesFn from '@/styles/select/SelectGroup.styles';

interface SelectGroupProps {
  items: SelectItem[];
  onValueChange: (selectedItem: SelectItem) => void;
  selectedItem: SelectItem;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  items,
  onValueChange,
  selectedItem,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable
          key={item.value}
          style={[
            styles.option,
            selectedItem.value === item.value && styles.selectedOption,
            index > 0 && styles.optionMargin,
          ]}
          onPress={() => onValueChange(item)}
        >
          <Text
            style={[
              styles.optionText,
              selectedItem.value === item.value && styles.selectedOptionText,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default SelectGroup;
