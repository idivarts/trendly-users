import { useTheme } from "@react-navigation/native";
import { Linking } from "react-native";

import { Text, View } from "@/components/theme/Themed";
import Button from "@/components/ui/button";
import ImageComponent from "@/shared-uis/components/image-component";
import Colors from "@/shared-uis/constants/Colors";
import stylesFn from "@/styles/modal/UploadModal.styles";
import {
  faCheck,
  faCheckCircle,
  faLink
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Chip, Modal } from "react-native-paper";

interface BrandModalProps {
  brand: {
    name: string;
    description: string;
    image: string;
    website: string;
    verified: boolean;
    category: string[];
  };
  visible: boolean;
  setVisibility: (visible: boolean) => void;
}

const BrandModal: React.FC<BrandModalProps> = ({
  brand,
  visible,
  setVisibility,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const getLinkMessage = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      if (hostname.includes("instagram.com")) {
        return "Visit Instagram";
      } else if (hostname.includes("facebook.com")) {
        return "Visit Facebook";
      } else {
        return "Visit Website";
      }
    } catch (error) {
      return "Visit Website";
    }
  }
  return (
    <Modal
      visible={visible}
      onDismiss={() => setVisibility(false)}
      contentContainerStyle={{
        backgroundColor: Colors(theme).background,
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
      }}
    >
      <View style={{ alignItems: "center", gap: 20 }}>
        {/* Brand Image */}
        <ImageComponent
          url={brand.image}
          altText="Brand Image"
          shape="square"
          style={{
            width: 120,
            height: 120,
            borderRadius: 10,
          }}
        />

        {/* Brand Name */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: Colors(theme).text,
            textAlign: "center",
          }}
        >
          {brand.name}{" "}
          {brand.verified && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              color={Colors(theme).primary}
              size={22}
            />
          )}
        </Text>

        {/* Brand Description */}
        {brand.description && (
          <Text
            style={{
              fontSize: 16,
              color: Colors(theme).text,
              textAlign: "center",
            }}
          >
            {brand.description}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {brand.category.map((cat, index) => (
            <Chip
              key={index}
              style={{
                margin: 5,
                alignItems: "center",
              }}
              mode="outlined"
              icon={() => (
                <FontAwesomeIcon
                  icon={faCheck}
                  color={Colors(theme).primary}
                  size={16}
                />
              )}
            >
              {cat}
            </Chip>
          ))}
        </View>

        {/* Brand Website */}
        <Button onPress={() => Linking.openURL(brand.website)}>
          <Text
            style={{
              fontSize: 16,
              color: Colors(theme).white,
              fontWeight: "bold",
            }}
          >
            <FontAwesomeIcon
              icon={faLink}
              color={Colors(theme).white}
              size={16}
              style={{ marginRight: 16 }}
            />
            {getLinkMessage(brand.website)}
          </Text>
        </Button>
      </View>
    </Modal>
  );
};

export default BrandModal;
