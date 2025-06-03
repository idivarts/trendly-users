import { Text, View } from "@/components/theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { PropsWithChildren } from "react";

interface ContentWrapperProps extends PropsWithChildren {
  description?: string;
  rightText?: string;
  title?: string;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  description,
  rightText,
  title,
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        gap: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {
          title && (
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {title}
            </Text>
          )
        }
        {
          rightText && (
            <Text>
              {rightText}
            </Text>
          )
        }
      </View>
      {children}
      {
        description && (
          <Text
            style={{
              fontSize: 14,
              color: theme.dark ? Colors(theme).text : Colors(theme).gray300,
            }}
          >
            {description}
          </Text>
        )
      }
    </View>
  );
};

export default ContentWrapper;
