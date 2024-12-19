import React from 'react';
import { View, StyleSheet } from 'react-native';
import MultiSlider, { MultiSliderProps } from '@ptomasroos/react-native-multi-slider';
import { Theme, useTheme } from '@react-navigation/native';
import Colors from '@/constants/Colors';

interface MultiRangeSliderProps extends MultiSliderProps {
  maxValue: number;
  minValue: number;
  onValuesChange?: (values: number[]) => void;
  values: number[];
}

export const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  containerStyle,
  maxValue,
  minValue,
  onValuesChange,
  selectedStyle,
  trackStyle,
  unselectedStyle,
  values,
  ...props
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const handleValuesChange = (newValues: number[]) => {
    onValuesChange?.(newValues);
  };

  const CustomMarker = () => (
    <View style={styles.customMarker} />
  );

  return (
    <MultiSlider
      values={values}
      min={minValue}
      max={maxValue}
      onValuesChange={handleValuesChange}
      sliderLength={280}
      selectedStyle={{
        ...styles.selectedTrack,
        ...selectedStyle,
      }}
      unselectedStyle={{
        ...styles.unselectedTrack,
        ...unselectedStyle,
      }}
      containerStyle={{
        ...styles.sliderContainer,
        ...containerStyle,
      }}
      trackStyle={{
        ...styles.track,
        ...trackStyle,
      }}
      customMarker={CustomMarker}
      {...props}
    />
  );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
  sliderContainer: {
    height: 40,
  },
  track: {
    height: 6,
    marginTop: -3,
    borderRadius: 2,
  },
  selectedTrack: {
    backgroundColor: Colors(theme).lightgray,
  },
  unselectedTrack: {
    backgroundColor: Colors(theme).lightgray,
  },
  customMarker: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: Colors(theme).primary,
  },
});
