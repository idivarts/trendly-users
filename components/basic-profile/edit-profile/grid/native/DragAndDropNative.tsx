import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Draggable from './Draggable';
import { useTheme } from '@react-navigation/native';
import DraggableItem, { AssetItem } from './DraggableItem';
import { gridStylesFn } from '@/styles/draggable-grid/DraggableGrid.styles';
import { Text } from '@/components/theme/Themed';

interface DragAndDropNativeProps {
  items: AssetItem[];
  onItemsUpdate?: (items: AssetItem[]) => void;
}

const DragAndDropNative: React.FC<DragAndDropNativeProps> = ({
  items,
  onItemsUpdate,
}) => {
  const [assets, setAssets] = useState<AssetItem[]>(items);
  const initialPositions = Object.assign({}, ...assets.map(item => item.id).map((id, index) => ({ [id]: index })));
  const positions = useSharedValue(initialPositions);

  const theme = useTheme();
  const styles = gridStylesFn(theme);

  const handlePositionsUpdate = (newPositions: Record<string, number>) => {
    const newFinalAssets = [...assets];

    Object.values(newPositions).map((newPosition, index) => {
      newFinalAssets[index] = assets[newPosition];
    });
    setAssets(newFinalAssets);
  };

  const handleAssetUpdate = (asset: AssetItem) => {
    const position = asset.id;
    const currentPosition = Object.keys(positions.value).find(key => Number(key) === position);

    const newAssets = assets.map(item => {
      if (item.id === Number(currentPosition)) {
        return asset;
      }
      return item;
    });
    setAssets(newAssets);
  }

  useEffect(() => {
    if (onItemsUpdate) {
      onItemsUpdate(assets);
    }
  }, [assets]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {assets.map((item) => (
          <Draggable
            key={item.id}
            positions={positions}
            id={item.id}
            onPositionsUpdate={handlePositionsUpdate}
          >
            <DraggableItem
              key={item.id}
              item={item}
              onAssetUpdate={(item) => handleAssetUpdate(item)}
            />
          </Draggable>
        ))}
      </View>
      <View
        style={styles.hintContainer}
      >
        <View
          style={styles.hintText}
        >
          <Text>Hold & drag your photos to change the order</Text>
        </View>
      </View>
    </View>
  );
};

export default DragAndDropNative;
