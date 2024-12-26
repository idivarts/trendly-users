import { Image, Pressable, Linking } from "react-native";
import { useTheme } from "@react-navigation/native";

import { Text, View } from "@/components/theme/Themed";
import stylesFn from "@/styles/modal/UploadModal.styles";
import { Chip, Modal } from "react-native-paper";
import Colors from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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
        <Image
          source={{ uri: brand.image }}
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
        <Text
          style={{
            fontSize: 16,
            color: Colors(theme).text,
            textAlign: "center",
          }}
        >
          {brand.description}
        </Text>

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
              }}
              mode="outlined"
            >
              {cat}
            </Chip>
          ))}
        </View>

        {/* Brand Website */}
        <Pressable
          onPress={() => Linking.openURL(brand.website)}
          style={{
            backgroundColor: Colors(theme).primary,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: Colors(theme).white,
              fontWeight: "bold",
            }}
          >
            Visit Website
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default BrandModal;
