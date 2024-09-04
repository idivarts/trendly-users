import { Pressable } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/theme/useColorScheme';
import { View } from '@/components/theme/Themed';

interface DrawerToggleButtonProps extends React.ComponentProps<typeof Pressable> { }

const DrawerToggleButton: React.FC<DrawerToggleButtonProps> = ({
  ...props
}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <Pressable
      {...props}
      key={0}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name='menu'
          size={26}
          style={[{
            marginLeft: 14,
            color: Colors[colorScheme ?? 'light'].text,
            marginBottom: -2,
          }]}
        />
      </View>
    </Pressable>
  )
};

export default DrawerToggleButton;
