import { useTheme } from "@react-navigation/native";
import { Platform, ScrollView } from "react-native";
import { stylesFn } from "@/styles/edit-profile/EditProfile.styles";

interface WrapperProps extends React.PropsWithChildren<{}> { }

const Wrapper: React.FC<WrapperProps> = ({
  children,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  if (Platform.OS === 'web') {
    return (
      <div
        style={{
          paddingBottom: 80,
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    );
  } else {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContentContainerStyle,
          {
            flexGrow: 0,
          }
        ]}
      >
        {children}
      </ScrollView>
    );
  };
};

export default Wrapper;
