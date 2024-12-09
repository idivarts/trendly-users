import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import * as MediaPicker from "expo-image-picker";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@react-navigation/native';
import { draggableGridStylesFn } from '@/styles/draggable-grid/DraggableGrid.styles';
import AssetRender from './AssetRender';

export type AssetItem = {
  id: number;
  url: string;
  type: string;
};

interface DraggableItemProps {
  item: AssetItem;
  onAssetUpdate: (asset: AssetItem) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  onAssetUpdate,
}) => {
  const theme = useTheme();
  const styles = draggableGridStylesFn(theme);
  const [asset, setAsset] = useState<AssetItem | null>(item);

  const openGallery = async () => {
    const { status } = await MediaPicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('We need camera permissions');
      return;
    }

    const result = await MediaPicker.launchImageLibraryAsync({
      mediaTypes: MediaPicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].type === 'video') {
      handleVideoUpload(result.assets[0].uri);
    } else if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  }

  const handleImageUpload = (image: string) => {
    setAsset({
      ...asset as AssetItem,
      url: image,
      type: 'image',
    });
    onAssetUpdate({
      ...asset as AssetItem,
      url: image,
      type: 'image',
    });
  }

  const handleVideoUpload = (video: string) => {
    setAsset({
      ...asset as AssetItem,
      url: video,
      type: 'video',
    });
    onAssetUpdate({
      ...asset as AssetItem,
      url: video,
      type: 'video',
    });
  }

  const handleRemoveAsset = () => {
    setAsset({
      id: item.id,
      url: '',
      type: '',
    });
    onAssetUpdate({
      id: item.id,
      url: '',
      type: '',
    });
  }

  return (
    <Pressable
      style={[
        styles.container,
      ]}
      onPress={openGallery}
    >
      {
        asset && asset.url ? (
          <AssetRender
            asset={asset}
          />
        ) : (
          <View
            style={styles.addButton}
          >
            <FontAwesomeIcon
              icon={faPlus}
              color={Colors(theme).white}
              size={16}
            />
          </View>
        )
      }
      {
        asset && asset.url && (
          <Pressable
            style={styles.removeButton}
            onPress={handleRemoveAsset}
          >
            <FontAwesomeIcon
              icon={faClose}
              color={Colors(theme).white}
              size={16}
            />
          </Pressable>
        )
      }
    </Pressable>
  );
};

export default DraggableItem;
